import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { findColorway, PRODUCTS } from "./colorways";

// The "cart" is the guest's colour picks. Strict rule of the workshop:
// every ticket = exactly ONE scented bouquet colour + exactly ONE scent.
// Picks are stored per ticket, so a ticket can never hold more than one colour of each.

const STORAGE_KEY = "mbm-lily-cart-v2";
const MAX_SEATS = 10;
const blank = () => ({ bouquet: null, scent: null });
const fit = (picks, seats) => Array.from({ length: seats }, (_, i) => picks[i] || blank());

const CartContext = createContext(null);

function load() {
  const empty = { seats: 1, picks: [blank()] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const data = JSON.parse(raw);
    const seats = Math.max(1, Math.min(MAX_SEATS, Number(data.seats) || 1));
    const picks = fit(
      (Array.isArray(data.picks) ? data.picks : []).map((p) => ({
        bouquet: findColorway("bouquet", p?.bouquet) ? p.bouquet : null,
        scent: findColorway("scent", p?.scent) ? p.scent : null,
      })),
      seats
    );
    return { seats, picks };
  } catch {
    return empty;
  }
}

export function CartProvider({ children }) {
  const [state, setState] = useState({ seats: 1, picks: [blank()] });
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeTicket, setActiveTicket] = useState(0);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — cart still works in memory */
    }
  }, [state, ready]);

  const { seats, picks } = state;

  const setSeats = useCallback((n) => {
    const next = Math.max(1, Math.min(MAX_SEATS, n));
    setState((s) => ({ seats: next, picks: fit(s.picks, next) }));
    setActiveTicket((t) => Math.min(t, next - 1));
  }, []);

  // Choosing a colour REPLACES whatever that ticket had for the product — never adds a second one.
  const pick = useCallback((ticket, product, variantId) => {
    setState((s) => ({
      ...s,
      picks: s.picks.map((p, i) => (i === ticket ? { ...p, [product]: variantId } : p)),
    }));
  }, []);

  const unpick = useCallback((ticket, product) => pick(ticket, product, null), [pick]);

  const clear = useCallback(() => {
    setState((s) => ({ ...s, picks: fit([], s.seats) }));
    setActiveTicket(0);
  }, []);

  const value = useMemo(() => {
    const countOf = (product) => picks.filter((p) => p[product]).length;
    const bouquets = countOf("bouquet");
    const scents = countOf("scent");

    // Aggregated per colour — [{ product, variantId, qty }] — what the RSVP + admin need to prepare.
    const items = [];
    for (const product of Object.keys(PRODUCTS)) {
      const tally = {};
      picks.forEach((p) => p[product] && (tally[p[product]] = (tally[p[product]] || 0) + 1));
      Object.entries(tally).forEach(([variantId, qty]) => items.push({ product, variantId, qty }));
    }
    const selections = items.map((i) => ({
      product: i.product,
      variant_id: i.variantId,
      name: findColorway(i.product, i.variantId)?.name || i.variantId,
      qty: i.qty,
    }));
    const ticketDone = (i) => !!(picks[i]?.bouquet && picks[i]?.scent);

    return {
      seats, picks, setSeats, pick, unpick, clear, countOf, items, selections,
      bouquets, scents, total: bouquets + scents, ticketDone,
      complete: picks.every((p) => p.bouquet && p.scent),
      activeTicket, setActiveTicket,
      open, setOpen, maxSeats: MAX_SEATS,
    };
  }, [seats, picks, setSeats, pick, unpick, clear, activeTicket, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
