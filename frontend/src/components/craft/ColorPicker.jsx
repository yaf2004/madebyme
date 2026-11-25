import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import { colorways, findColorway, PRODUCTS } from "./colorways";
import { ProductArt } from "./ColorArt";

const FUCHSIA = "#A93A60";
const TOBAGO = "#402B24";

function Stepper({ value, onChange, label, max = 10 }) {
  const btn = "focus-craft flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:opacity-40";
  return (
    <div className="flex items-center gap-3">
      <button type="button" className={btn} style={{ border: "1.5px solid rgba(64,43,36,0.25)", color: TOBAGO }}
        aria-label={`Fewer ${label}`} disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="font-display w-6 text-center text-2xl" style={{ color: TOBAGO }} aria-live="polite">{value}</span>
      <button type="button" className={btn} style={{ border: "1.5px solid rgba(64,43,36,0.25)", color: TOBAGO }}
        aria-label={`More ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export { Stepper };

/* One swipeable slide: a single colourway with a "choose" button. */
function Slide({ product, colorway, chosen, ticketLabel, onChoose }) {
  const label = product === "scent" ? `${colorway.name} scent` : `${colorway.name} bouquet`;
  return (
    <article
      className="flex w-[78%] max-w-[340px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl bg-white"
      style={{
        border: `2px solid ${chosen ? FUCHSIA : "#F1D7D6"}`,
        boxShadow: chosen ? "0 12px 34px rgba(169,58,96,0.22)" : "0 2px 18px rgba(64,43,36,0.06)",
        transition: "border-color .25s, box-shadow .25s",
      }}
      aria-label={label}
    >
      <div className={`relative flex items-center justify-center overflow-hidden ${product === "scent" ? "aspect-[3/4]" : "aspect-[4/5]"}`} style={{ backgroundColor: colorway.bg }}>
        {product === "scent" ? (
          <img src={colorway.image} alt={`${colorway.name} — ${colorway.note}`} className="h-full w-full object-cover" draggable={false} />
        ) : (
          <>
            <div className="lily-pattern-white pointer-events-none absolute inset-0" style={{ opacity: 0.35 }} />
            <ProductArt product={product} colorway={colorway} className="relative h-[86%] w-[86%] drop-shadow-lg" />
          </>
        )}
        {chosen && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
            style={{ backgroundColor: FUCHSIA }}>
            <Check className="h-3 w-3" /> {ticketLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h4 className="font-display text-2xl leading-tight" style={{ color: TOBAGO, fontWeight: 500 }}>{colorway.name}</h4>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(64,43,36,0.65)" }}>{colorway.note}</p>
        {product === "bouquet" && (
          <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
            {colorway.swatches.map((c) => (
              <span key={c} className="h-5 w-5 rounded-full" style={{ backgroundColor: c, border: "1.5px solid rgba(64,43,36,0.15)" }} />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={onChoose}
          aria-pressed={chosen}
          className="focus-craft mt-5 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
          style={chosen
            ? { backgroundColor: "#8E9A82", color: "#fff" }
            : { backgroundColor: FUCHSIA, color: "#F8F3ED" }}
        >
          {chosen ? <><Check className="h-4 w-4" /> Chosen</> : product === "scent" ? "Choose this scent" : "Choose this colour"}
        </button>
      </div>
    </article>
  );
}

/* A single-slide-at-a-time carousel (neighbours peek in). Swipe, drag-scroll, arrows or dots. */
function Carousel({ product, ticket, chosenId, onChoose }) {
  const scroller = useRef(null);
  const list = colorways[product];
  const [index, setIndex] = useState(Math.max(0, list.findIndex((c) => c.id === chosenId)));

  const slideEls = () => Array.from(scroller.current?.children || []);

  const goTo = useCallback((i, smooth = true) => {
    const el = scroller.current;
    const s = slideEls()[i];
    if (!el || !s) return;
    el.scrollTo({ left: s.offsetLeft - (el.clientWidth - s.clientWidth) / 2, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Start on the colour already chosen for this ticket (or the first one).
  useEffect(() => {
    const i = Math.max(0, list.findIndex((c) => c.id === chosenId));
    setIndex(i);
    goTo(i, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, ticket]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, dist = Infinity;
    slideEls().forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    setIndex(best);
  };

  const arrow = "focus-craft flex h-11 w-11 items-center justify-center rounded-full bg-white transition-opacity disabled:opacity-30";

  return (
    <div>
      <div
        ref={scroller}
        onScroll={onScroll}
        tabIndex={0}
        role="region"
        aria-label={`${PRODUCTS[product].label} options — swipe sideways`}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-3"
        style={{ paddingInline: "max(11%, calc(50% - 170px))" }}
      >
        {list.map((c) => (
          <Slide
            key={c.id}
            product={product}
            colorway={c}
            chosen={c.id === chosenId}
            ticketLabel={`Ticket ${ticket + 1}`}
            onChoose={() => onChoose(c.id)}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-5">
        <button type="button" className={arrow} style={{ border: "1.5px solid rgba(64,43,36,0.25)", color: TOBAGO }}
          aria-label="Previous colour" disabled={index <= 0} onClick={() => goTo(index - 1)}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Colour">
          {list.map((c, i) => (
            <button key={c.id} type="button" role="tab" aria-selected={i === index} aria-label={c.name} onClick={() => goTo(i)}
              className="focus-craft h-2.5 rounded-full transition-all"
              style={{ width: i === index ? 26 : 10, backgroundColor: i === index ? FUCHSIA : "rgba(64,43,36,0.22)" }} />
          ))}
        </div>
        <button type="button" className={arrow} style={{ border: "1.5px solid rgba(64,43,36,0.25)", color: TOBAGO }}
          aria-label="Next colour" disabled={index >= list.length - 1} onClick={() => goTo(index + 1)}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default function ColorPicker({ onReserve }) {
  const { total, setOpen, seats, setSeats, maxSeats, picks, pick, ticketDone, complete, activeTicket, setActiveTicket } = useCart();
  const [product, setProduct] = useState("bouquet");
  const ticket = Math.min(activeTicket, seats - 1);
  const mine = picks[ticket] || {};
  const done = ticketDone(ticket);
  const nextOpen = picks.findIndex((p, i) => i !== ticket && !(p.bouquet && p.scent));

  const choose = (id) => {
    pick(ticket, product, id);
    // Move on to the other product if that one is still empty for this ticket.
    const other = product === "bouquet" ? "scent" : "bouquet";
    if (!mine[other]) setTimeout(() => setProduct(other), 450);
  };

  const tab = (active) => ({
    backgroundColor: active ? FUCHSIA : "#fff",
    color: active ? "#F8F3ED" : TOBAGO,
    border: `1.5px solid ${active ? FUCHSIA : "#EBCFCB"}`,
  });

  return (
    <section id="colours" className="relative overflow-hidden px-6 py-20 md:px-14 md:py-28" style={{ backgroundColor: "#F1D7D6" }}>
      <div className="lily-pattern-white pointer-events-none absolute inset-0" style={{ opacity: 0.4 }} />
      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.45em]" style={{ color: FUCHSIA }}>Pick your palette &amp; scent</p>
          <h2 className="font-display leading-[1.05]" style={{ color: TOBAGO, fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)", fontWeight: 500 }}>
            Choose your <em>colour &amp; scent</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "rgba(64,43,36,0.7)" }}>
            Each ticket gets <strong>one bouquet colour</strong> and <strong>one scent</strong> for your mini perfume. Swipe through,
            tap the one you love, and we'll prepare it in advance.
          </p>

          <div className="mt-6 inline-flex items-center gap-4 rounded-full bg-white px-5 py-2.5" style={{ border: "1.5px solid #EBCFCB" }}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "rgba(64,43,36,0.6)" }}>Tickets</span>
            <Stepper value={seats} max={maxSeats} label="tickets" onChange={setSeats} />
          </div>
        </motion.div>

        {/* Which ticket are we choosing for */}
        {seats > 1 && (
          <div className="no-scrollbar mb-5 flex justify-start gap-2 overflow-x-auto sm:justify-center" role="tablist" aria-label="Ticket">
            {picks.map((_, i) => (
              <button key={i} type="button" role="tab" aria-selected={i === ticket} onClick={() => setActiveTicket(i)}
                className="focus-craft inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors"
                style={tab(i === ticket)}>
                {ticketDone(i) && <Check className="h-3 w-3" />} Ticket {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Bouquet / Key chain switch */}
        <div className="mb-3 grid grid-cols-2 gap-2 rounded-full bg-white/60 p-1.5" role="tablist" aria-label="What are you choosing">
          {Object.values(PRODUCTS).map((p, i) => {
            const picked = findColorway(p.id, mine[p.id]);
            return (
              <button key={p.id} type="button" role="tab" aria-selected={product === p.id} onClick={() => setProduct(p.id)}
                className="focus-craft flex min-h-[48px] flex-col items-center justify-center rounded-full px-3 py-1.5 text-center transition-colors"
                style={tab(product === p.id)}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">{i + 1}. {p.id === "bouquet" ? "Bouquet colour" : "Perfume scent"}</span>
                <span className="text-[11px] opacity-80">{picked ? <><Check className="mr-0.5 inline h-3 w-3" />{picked.name}</> : "Not chosen yet"}</span>
              </button>
            );
          })}
        </div>

        <p className="mb-1 text-center text-xs" style={{ color: "rgba(64,43,36,0.6)" }}>
          Choosing for <strong>Ticket {ticket + 1}</strong> · only one {product === "bouquet" ? "bouquet colour" : "scent"} per ticket — tap another to swap
        </p>

        <Carousel
          key={product + ticket}
          product={product}
          ticket={ticket}
          chosenId={mine[product]}
          onChoose={choose}
        />

        {/* Status */}
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          {done && nextOpen !== -1 && (
            <button type="button" onClick={() => { setActiveTicket(nextOpen); setProduct("bouquet"); }}
              className="focus-craft inline-flex min-h-[46px] items-center gap-2 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: FUCHSIA, color: "#F8F3ED" }}>
              Ticket {ticket + 1} is set — now Ticket {nextOpen + 1} <ChevronRight className="h-4 w-4" />
            </button>
          )}
          {complete && (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium" style={{ color: "#5E6E54", border: "1.5px solid #C3C7B9" }}>
              <Check className="h-3.5 w-3.5" /> {seats > 1 ? `All ${seats} tickets are set` : "Your ticket is set"}
            </p>
          )}

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="focus-craft inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-7 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: TOBAGO, border: "1.5px solid #DBA1A3" }}
          >
            <ShoppingBag className="h-4 w-4" /> View my cart{total > 0 ? ` (${total})` : ""}
          </button>
          <button
            type="button"
            onClick={onReserve}
            className="focus-craft text-xs font-medium uppercase tracking-[0.2em] underline underline-offset-4"
            style={{ color: FUCHSIA }}
          >
            Continue to reserve my spot
          </button>
        </div>
      </div>
    </section>
  );
}
