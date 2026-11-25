import React, { useEffect, useRef } from "react";
import { ShoppingBag, X, Check, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import { Stepper } from "./ColorPicker";
import { findColorway, PRODUCTS } from "./colorways";
import { ProductArt } from "./ColorArt";

const FUCHSIA = "#A93A60";
const TOBAGO = "#402B24";

function Row({ product, variantId, onRemove }) {
  const cw = findColorway(product, variantId);
  if (!cw) {
    return (
      <div className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm" style={{ backgroundColor: "rgba(64,43,36,0.04)", color: "rgba(64,43,36,0.55)" }}>
        <span>{product === "scent" ? "Perfume scent" : "Bouquet colour"}</span><span>Not chosen yet</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-2.5" style={{ border: "1.5px solid #F1D7D6" }}>
      <div className="flex h-14 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl" style={{ backgroundColor: cw.bg }}>
        <ProductArt product={product} colorway={cw} className={product === "scent" ? "h-full w-full" : "h-12 w-10"} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(64,43,36,0.5)" }}>{product === "scent" ? "Perfume scent" : "Bouquet colour"}</p>
        <p className="font-display truncate text-lg leading-tight" style={{ color: TOBAGO }}>{cw.name}</p>
      </div>
      <button type="button" onClick={onRemove} aria-label={`Remove ${cw.name}`}
        className="focus-craft flex h-8 w-8 items-center justify-center rounded-full" style={{ color: "rgba(64,43,36,0.5)" }}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CartButton() {
  const { total, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Open your picks, ${total} item${total === 1 ? "" : "s"}`}
      className="focus-craft fixed bottom-5 right-5 z-40 inline-flex min-h-[52px] items-center gap-2 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.18em] shadow-lg transition-transform hover:-translate-y-0.5"
      style={{ backgroundColor: TOBAGO, color: "#F8F3ED", boxShadow: "0 10px 30px rgba(64,43,36,0.35)" }}
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="hidden sm:inline">My picks</span>
      <span className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px]" style={{ backgroundColor: "#EE90A7", color: TOBAGO }}>
        {total}
      </span>
    </button>
  );
}

export default function CartDrawer() {
  const { open, setOpen, seats, setSeats, maxSeats, picks, unpick, ticketDone, setActiveTicket, bouquets, scents, complete, total, clear } = useCart();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setOpen]);

  const goReserve = () => {
    setOpen(false);
    setTimeout(() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const goPick = () => {
    setOpen(false);
    setTimeout(() => document.getElementById("colours")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  let hint = "Your colours are saved — add them to your RSVP.";
  if (!complete) {
    const todo = picks.map((p, i) => (p.bouquet && p.scent ? null : i + 1)).filter(Boolean);
    hint = `Each ticket needs one bouquet colour and one perfume scent — still to choose: ticket${todo.length > 1 ? "s" : ""} ${todo.join(", ")}.`;
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(64,43,36,0.5)", opacity: open ? 1 : 0 }}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your picks"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col transition-transform duration-300"
        style={{ backgroundColor: "#F8F3ED", transform: open ? "translateX(0)" : "translateX(100%)", boxShadow: "-12px 0 40px rgba(64,43,36,0.25)" }}
      >
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #EBCFCB" }}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: FUCHSIA }}>Your cart</p>
            <h2 className="font-display text-3xl" style={{ color: TOBAGO, fontWeight: 500 }}>Your picks</h2>
          </div>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close cart"
            className="focus-craft flex h-10 w-10 items-center justify-center rounded-full" style={{ border: "1.5px solid rgba(64,43,36,0.25)", color: TOBAGO }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3" style={{ border: "1.5px solid #F1D7D6" }}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "rgba(64,43,36,0.6)" }}>Tickets</span>
            <Stepper value={seats} max={maxSeats} label="tickets" onChange={setSeats} />
          </div>
          <p className="mt-2 text-xs" style={{ color: "rgba(64,43,36,0.6)" }}>One bouquet colour + one perfume scent per ticket.</p>

          <div className="mt-5 space-y-4">
            {picks.map((p, i) => (
              <section key={i} className="rounded-3xl p-3" style={{ backgroundColor: "rgba(241,215,214,0.35)", border: "1px solid #EBCFCB" }}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <h3 className="font-display text-2xl" style={{ color: TOBAGO }}>Ticket {i + 1}</h3>
                  {ticketDone(i)
                    ? <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#5E6E54" }}><Check className="mr-1 inline h-3 w-3" />Ready</span>
                    : <button type="button" onClick={() => { setActiveTicket(i); goPick(); }} className="focus-craft text-[11px] font-semibold uppercase tracking-[0.18em] underline underline-offset-4" style={{ color: FUCHSIA }}>Choose</button>}
                </div>
                <div className="space-y-2">
                  <Row product="bouquet" variantId={p.bouquet} onRemove={() => unpick(i, "bouquet")} />
                  <Row product="scent" variantId={p.scent} onRemove={() => unpick(i, "scent")} />
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="space-y-3 px-6 py-5" style={{ borderTop: "1px solid #EBCFCB", backgroundColor: "#fff" }}>
          <p className="text-xs leading-relaxed" style={{ color: complete ? "#5E6E54" : FUCHSIA }}>{hint}</p>
          <button type="button" onClick={complete ? goReserve : goPick}
            className="focus-craft flex min-h-[50px] w-full items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
            style={{ backgroundColor: FUCHSIA, color: "#F8F3ED" }}>
            {complete ? "Continue to RSVP" : "Keep choosing colours"}
          </button>
          {total > 0 && (
            <button type="button" onClick={clear}
              className="focus-craft mx-auto flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: "rgba(64,43,36,0.55)" }}>
              <Trash2 className="h-3.5 w-3.5" /> Clear cart
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
