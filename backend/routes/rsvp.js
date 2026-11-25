import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '../db.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    selected_package TEXT NOT NULL,
    number_of_seats INTEGER DEFAULT 1,
    guest_names TEXT,
    payment_method TEXT DEFAULT 'screenshot',
    payment_link TEXT,
    payment_screenshot_url TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// Older databases won't have the colour picks column yet — add it once.
if (!db.prepare('PRAGMA table_info(rsvps)').all().some((c) => c.name === 'color_selections')) {
  db.exec('ALTER TABLE rsvps ADD COLUMN color_selections TEXT');
}

const PRODUCTS = ['bouquet', 'scent'];

// color_selections: JSON array of { product, variant_id, name, qty }.
// Every ticket = 1 bouquet colour + 1 perfume scent, so both totals must equal the seat count.
function parseSelections(raw, seats) {
  let list;
  try { list = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return { error: 'color_selections must be valid JSON.' }; }
  if (!Array.isArray(list)) return { error: 'color_selections must be a list.' };
  const clean = [];
  for (const item of list) {
    const qty = Number(item?.qty);
    if (!PRODUCTS.includes(item?.product) || typeof item?.variant_id !== 'string' || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      return { error: 'Invalid colour selection.' };
    }
    clean.push({ product: item.product, variant_id: item.variant_id.slice(0, 60), name: String(item.name || item.variant_id).slice(0, 80), qty });
  }
  for (const p of PRODUCTS) {
    const total = clean.filter((i) => i.product === p).reduce((n, i) => n + i.qty, 0);
    if (total !== seats) return { error: `Please choose ${seats} ${p === 'bouquet' ? 'bouquet colour' : 'perfume scent'}${seats > 1 ? 's' : ''} (one of each per ticket).` };
  }
  return { value: JSON.stringify(clean) };
}

const ADMIN_PASSWORDS = [process.env.ADMIN_PASSWORD, process.env.VITE_ADMIN_PASSWORD, 'madebyme2025']
  .filter(Boolean)
  .map((value) => value.trim().toLowerCase());

const getAdminPassword = (req) => {
  const fromQuery = req.query?.password;
  const fromBody = req.body?.password;
  const fromHeader = req.headers['x-admin-password'];
  return [fromQuery, fromBody, fromHeader].find((value) => typeof value === 'string' && value.trim())?.trim();
};

const isValidAdminPassword = (value) => {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return ADMIN_PASSWORDS.includes(normalized);
};

export const rsvpRouter = express.Router();

// POST /api/rsvp
rsvpRouter.post('/', (req, res) => {
  const { full_name, email, phone, selected_package, number_of_seats, guest_names, payment_method, payment_link, payment_screenshot_url, message, color_selections } = req.body;
  if (!full_name || !email || !selected_package) {
    return res.status(400).json({ message: 'full_name, email, and selected_package are required.' });
  }
  if (!phone) {
    return res.status(400).json({ message: 'phone is required.' });
  }
  const hasProof = (payment_method === 'link' && payment_link) || (payment_method !== 'link' && payment_screenshot_url);
  if (!hasProof) {
    return res.status(400).json({ message: 'Payment proof (screenshot or payment link) is required.' });
  }
  const seats = Math.max(1, Math.min(10, parseInt(number_of_seats, 10) || 1));
  const picks = parseSelections(color_selections, seats);
  if (picks.error) return res.status(400).json({ message: picks.error });
  const result = db.prepare(`
    INSERT INTO rsvps (full_name, email, phone, selected_package, number_of_seats, guest_names, payment_method, payment_link, payment_screenshot_url, message, color_selections)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(full_name, email, phone || null, selected_package, seats, guest_names || full_name, payment_method || 'screenshot', payment_link || null, payment_screenshot_url || null, message || null, picks.value);
  return res.status(201).json({ id: result.lastInsertRowid, status: 'pending' });
});

// GET /api/rsvp?password=xxx
rsvpRouter.get('/', (req, res) => {
  if (!isValidAdminPassword(getAdminPassword(req))) return res.status(401).json({ message: 'Unauthorized' });
  const rows = db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC').all();
  res.json(rows);
});

// PATCH /api/rsvp/:id/status?password=xxx
rsvpRouter.patch('/:id/status', (req, res) => {
  if (!isValidAdminPassword(getAdminPassword(req))) return res.status(401).json({ message: 'Unauthorized' });
  const { status } = req.body;
  if (!['pending', 'confirmed', 'declined'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
  db.prepare('UPDATE rsvps SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});
