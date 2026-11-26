import express from 'express';
import pg from 'pg';
const { Pool } = pg;
if (!process.env.DATABASE_URL) console.error('DATABASE_URL is missing. RSVP persistence is unavailable.');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
  max: 5, idleTimeoutMillis: 30000, connectionTimeoutMillis: 10000,
});
const initPromise = pool.query(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id BIGSERIAL PRIMARY KEY, full_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
    selected_package TEXT NOT NULL, number_of_seats INTEGER DEFAULT 1, guest_names TEXT,
    payment_method TEXT DEFAULT 'screenshot', payment_link TEXT, payment_screenshot_url TEXT,
    message TEXT, status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW(),
    color_selections TEXT
  )
`).then(() => pool.query('CREATE INDEX IF NOT EXISTS rsvps_created_at_idx ON rsvps (created_at DESC)'));
const PRODUCTS = ['bouquet', 'scent'];
function parseSelections(raw, seats) {
  let list;
  try { list = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return { error: 'color_selections must be valid JSON.' }; }
  if (!Array.isArray(list)) return { error: 'color_selections must be a list.' };
  const clean = [];
  for (const item of list) {
    const qty = Number(item?.qty);
    if (!PRODUCTS.includes(item?.product) || typeof item?.variant_id !== 'string' || !Number.isInteger(qty) || qty < 1 || qty > 10) return { error: 'Invalid colour selection.' };
    clean.push({ product: item.product, variant_id: item.variant_id.slice(0, 60), name: String(item.name || item.variant_id).slice(0, 80), qty });
  }
  for (const product of PRODUCTS) {
    const total = clean.filter((item) => item.product === product).reduce((n, item) => n + item.qty, 0);
    if (total !== seats) return { error: `Please choose ${seats} ${product === 'bouquet' ? 'bouquet colour' : 'perfume scent'}${seats > 1 ? 's' : ''} (one of each per ticket).` };
  }
  return { value: JSON.stringify(clean) };
}
const ADMIN_PASSWORDS = [process.env.ADMIN_PASSWORD, process.env.VITE_ADMIN_PASSWORD, 'madebyme2025'].filter(Boolean).map((v) => v.trim().toLowerCase());
const getAdminPassword = (req) => [req.query?.password, req.body?.password, req.headers['x-admin-password']].find((v) => typeof v === 'string' && v.trim())?.trim();
const isValidAdminPassword = (value) => typeof value === 'string' && ADMIN_PASSWORDS.includes(value.trim().toLowerCase());
export const rsvpRouter = express.Router();
rsvpRouter.post('/', async (req, res) => {
  try {
    await initPromise;
    const { full_name, email, phone, selected_package, number_of_seats, guest_names, payment_method, payment_link, payment_screenshot_url, message, color_selections } = req.body;
    if (!full_name || !email || !selected_package) return res.status(400).json({ message: 'full_name, email, and selected_package are required.' });
    if (!phone) return res.status(400).json({ message: 'phone is required.' });
    const hasProof = (payment_method === 'link' && payment_link) || (payment_method !== 'link' && payment_screenshot_url);
    if (!hasProof) return res.status(400).json({ message: 'Payment proof (screenshot or payment link) is required.' });
    const seats = Math.max(1, Math.min(10, parseInt(number_of_seats, 10) || 1));
    const picks = parseSelections(color_selections, seats);
    if (picks.error) return res.status(400).json({ message: picks.error });
    const result = await pool.query(`INSERT INTO rsvps (full_name,email,phone,selected_package,number_of_seats,guest_names,payment_method,payment_link,payment_screenshot_url,message,color_selections) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [full_name,email,phone || null,selected_package,seats,guest_names || full_name,payment_method || 'screenshot',payment_link || null,payment_screenshot_url || null,message || null,picks.value]);
    return res.status(201).json({ id: result.rows[0].id, status: 'pending' });
  } catch (error) {
    console.error('RSVP save failed:', error);
    return res.status(500).json({ message: 'Could not save your RSVP. Please try again.' });
  }
});
rsvpRouter.get('/', async (req, res) => {
  if (!isValidAdminPassword(getAdminPassword(req))) return res.status(401).json({ message: 'Unauthorized' });
  try { await initPromise; const result = await pool.query('SELECT * FROM rsvps ORDER BY created_at DESC'); res.json(result.rows); }
  catch (error) { console.error('RSVP list failed:', error); res.status(500).json({ message: 'Could not load RSVPs.' }); }
});
rsvpRouter.patch('/:id/status', async (req, res) => {
  if (!isValidAdminPassword(getAdminPassword(req))) return res.status(401).json({ message: 'Unauthorized' });
  const { status } = req.body;
  if (!['pending','confirmed','declined'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
  try {
    await initPromise;
    const result = await pool.query('UPDATE rsvps SET status=$1 WHERE id=$2 RETURNING id', [status, req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'RSVP not found.' });
    res.json({ success: true });
  } catch (error) { console.error('RSVP status update failed:', error); res.status(500).json({ message: 'Could not update RSVP status.' }); }
});
