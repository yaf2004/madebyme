import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Link2, Check, Loader2, Image as ImageIcon, Heart, Plus, Minus } from "lucide-react";
import { api } from "@/api/client";
import { eventDetails, ticketIncludes } from "./packages";
import { useCart } from "./CartContext";
import { findColorway, PRODUCTS } from "./colorways";

const WORKSHOP_ITEMS = "Flower Bouquet + Key Chain + Mini Perfume";

export default function RSVPForm() {
  const cart = useCart();
  const [submittedPicks, setSubmittedPicks] = useState([]);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    guest_names: [],
    payment_method: "screenshot",
    payment_link: "",
    payment_screenshot_url: "",
    message: "",
  });

  const seats = cart.seats;
  const guestNames = Array.from({ length: seats }, (_, i) => form.guest_names[i] || "");
  const totalDue = eventDetails.entranceFee * seats;
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const setGuestName = (i, val) => {
    const names = [...guestNames];
    names[i] = val;
    set("guest_names", names);
  };

  const goToColours = () => document.getElementById("colours")?.scrollIntoView({ behavior: "smooth" });

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { file_url } = await api.upload.file(file);
      set("payment_screenshot_url", file_url);
    } catch (err) {
      setError(err?.message || "Upload failed. Please try again or use the payment link option.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emptyNames = guestNames.some((n) => !n.trim());
    if (emptyNames) {
      setError("Please fill in the name for every guest.");
      return;
    }

    if (!cart.complete) {
      setError(`Please choose a bouquet colour and a perfume scent for every ticket — one of each (you have ${cart.bouquets} of ${seats} bouquet colours and ${cart.scents} of ${seats} scents).`);
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter a phone number so we can reach you.");
      return;
    }

    if (form.payment_method === "screenshot" && !form.payment_screenshot_url) {
      setError("Please upload a payment screenshot to confirm your spot.");
      return;
    }
    if (form.payment_method === "link" && !form.payment_link.trim()) {
      setError("Please enter your payment link or transaction ID.");
      return;
    }

    setSubmitting(true);
    try {
      await api.rsvp.create({
        full_name: guestNames[0],
        email: form.email,
        phone: form.phone,
        selected_package: WORKSHOP_ITEMS,
        number_of_seats: seats,
        guest_names: guestNames.join(", "),
        color_selections: JSON.stringify(cart.selections),
        payment_method: form.payment_method,
        payment_link: form.payment_link,
        payment_screenshot_url: form.payment_screenshot_url,
        message: form.message,
      });
      setSubmittedPicks(cart.selections);
      cart.clear();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or DM us on Instagram.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success ──
  if (submitted) {
    return (
      <div className="flex min-h-[560px] items-center justify-center px-6 py-24" style={{ backgroundColor: "#F8F3ED" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: "#A93A60" }}>
            <Heart className="h-8 w-8 text-white" fill="white" />
          </div>
          <h3 className="font-display text-4xl" style={{ color: "#402B24", fontStyle: "italic", fontWeight: 500 }}>
            You're in! 💌
          </h3>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(64,43,36,0.65)" }}>
            We've reserved <strong style={{ color: "#402B24" }}>{seats} spot{seats > 1 ? "s" : ""}</strong> for{" "}
            <strong style={{ color: "#402B24" }}>{guestNames.join(", ")}</strong> for{" "}
            <strong style={{ color: "#402B24" }}>Make Your Scented Bouquet</strong>.
          </p>
          {submittedPicks.length > 0 && (
            <ul className="mx-auto mt-5 max-w-xs space-y-1 rounded-2xl bg-white p-4 text-left text-sm" style={{ border: "1.5px solid #F1D7D6", color: "#402B24" }}>
              {submittedPicks.map((p) => (
                <li key={p.product + p.variant_id} className="flex justify-between gap-3">
                  <span>{PRODUCTS[p.product]?.label}</span>
                  <span className="font-medium">{p.name} × {p.qty}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(64,43,36,0.6)" }}>
            Your ticket covers the crafts, refreshment from Sene, games & karaoke and a blind gift. See you there! 🌸
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.25em]" style={{ color: "#A93A60" }}>
            {eventDetails.date} · {eventDetails.venue}
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Form ──
  return (
    <section id="rsvp" className="relative overflow-hidden px-6 py-20 md:px-14 md:py-28" style={{ backgroundColor: "#E3E6DA" }}>
      <div className="lily-pattern pointer-events-none absolute inset-0" style={{ opacity: 0.55 }} />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.45em]" style={{ color: "#A93A60" }}>
            RSVP
          </p>
          <h2 className="font-display" style={{ color: "#402B24", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontStyle: "italic", fontWeight: 500 }}>
            Reserve your spot
          </h2>
          <p className="mt-3 text-sm" style={{ color: "rgba(64,43,36,0.55)" }}>
            One ticket ({eventDetails.entranceFee.toLocaleString()} {eventDetails.currency}) covers <strong style={{ color: "#A93A60" }}>everything</strong> — both activities,
            <br />refreshment from Sene, games & karaoke and a blind gift from Made by Me.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Summary sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 rounded-2xl p-7" style={{ border: "1px solid rgba(64,43,36,0.1)", backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: "rgba(64,43,36,0.4)" }}>
                Your RSVP
              </p>

              <div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#DBA1A3" }} />
                    <span className="font-display text-xl" style={{ color: "#402B24" }}>Flower Bouquet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#EC9A5B" }} />
                    <span className="font-display text-xl" style={{ color: "#402B24" }}>Flower Key Chain</span>
                  </li>
                </ul>

                <ul className="mt-4 space-y-1">
                  {ticketIncludes.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-xs" style={{ color: "rgba(64,43,36,0.6)" }}>
                      <Check className="h-3 w-3 shrink-0" style={{ color: "#7C8870" }} /> {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(64,43,36,0.1)" }}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: "rgba(64,43,36,0.45)" }}>Your picks</p>
                  {cart.items.length === 0 ? (
                    <button type="button" onClick={goToColours} className="focus-craft text-xs underline underline-offset-4" style={{ color: "#A93A60" }}>
                      Choose your colour & scent →
                    </button>
                  ) : (
                    <ul className="space-y-1 text-xs" style={{ color: "rgba(64,43,36,0.75)" }}>
                      {cart.items.map((i) => (
                        <li key={i.product + i.variantId} className="flex justify-between gap-2">
                          <span>{PRODUCTS[i.product].label}</span>
                          <span className="font-medium">{findColorway(i.product, i.variantId)?.name} × {i.qty}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-5 space-y-2 pt-5" style={{ borderTop: "1px solid rgba(64,43,36,0.1)" }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "rgba(64,43,36,0.55)" }}>Ticket</span>
                    <span style={{ color: "#402B24" }}>{eventDetails.entranceFee.toLocaleString()} birr × {seats}</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2" style={{ borderTop: "1px solid rgba(64,43,36,0.1)" }}>
                    <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(64,43,36,0.5)" }}>Due now</span>
                    <span className="font-display text-4xl" style={{ color: "#A93A60" }}>
                      {totalDue.toLocaleString()} birr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl p-6 md:p-9 lg:col-span-8" style={{ backgroundColor: "rgba(255,255,255,0.82)", border: "1px solid rgba(64,43,36,0.08)" }}>

            {/* Tickets */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: "rgba(64,43,36,0.4)" }}>
                Number of tickets
              </p>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => cart.setSeats(seats - 1)}
                  className="focus-craft flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                  style={{ border: "1.5px solid rgba(64,43,36,0.2)", color: "#402B24" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(64,43,36,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-display text-4xl" style={{ color: "#402B24", fontStyle: "italic", minWidth: "2rem", textAlign: "center" }}>
                  {seats}
                </span>
                <button type="button" onClick={() => cart.setSeats(seats + 1)}
                  className="focus-craft flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                  style={{ border: "1.5px solid rgba(64,43,36,0.2)", color: "#402B24" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(64,43,36,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="text-sm" style={{ color: "rgba(64,43,36,0.45)" }}>
                  ticket{seats > 1 ? "s" : ""} · {totalDue.toLocaleString()} birr total
                </span>
              </div>
            </div>

            {/* Guest names — one field per ticket */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: "rgba(64,43,36,0.4)" }}>
                Guest names <span style={{ color: "#A93A60" }}>*</span>
              </p>
              <div className="space-y-3">
                {guestNames.map((name, i) => (
                  <div key={i}>
                    <label className="block">
                      <span className="mb-1 block text-[11px] uppercase tracking-wider" style={{ color: "rgba(64,43,36,0.35)" }}>
                        {i === 0 ? "Your name" : `Guest ${i + 1}`}
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setGuestName(i, e.target.value)}
                        className="craft-input"
                        placeholder={i === 0 ? "Your full name" : `Guest ${i + 1} full name`}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Colours */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: "rgba(64,43,36,0.4)" }}>
                Your picks <span style={{ color: "#A93A60" }}>*</span>
              </p>
              <div className="rounded-2xl p-4" style={{ backgroundColor: "rgba(64,43,36,0.03)", border: "1px solid rgba(64,43,36,0.12)" }}>
                {["bouquet", "scent"].map((p) => {
                  const n = p === "bouquet" ? cart.bouquets : cart.scents;
                  const ok = n === seats;
                  const rows = cart.items.filter((i) => i.product === p);
                  return (
                    <div key={p} className="py-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-display text-xl" style={{ color: "#402B24" }}>{PRODUCTS[p].plural}</span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ok ? "#5E6E54" : "#A93A60" }}>
                          {ok && <Check className="mr-1 inline h-3 w-3" />}{n} of {seats}
                        </span>
                      </div>
                      {rows.length > 0 && (
                        <p className="mt-0.5 text-xs" style={{ color: "rgba(64,43,36,0.65)" }}>
                          {rows.map((r) => `${findColorway(p, r.variantId)?.name} × ${r.qty}`).join(" · ")}
                        </p>
                      )}
                    </div>
                  );
                })}
                <div className="mt-2 flex flex-wrap items-center gap-4 pt-3" style={{ borderTop: "1px solid rgba(64,43,36,0.1)" }}>
                  <button type="button" onClick={goToColours} className="focus-craft text-xs font-semibold uppercase tracking-[0.18em] underline underline-offset-4" style={{ color: "#A93A60" }}>
                    {cart.items.length ? "Change picks" : "Choose colour & scent"}
                  </button>
                  <button type="button" onClick={() => cart.setOpen(true)} className="focus-craft text-xs font-medium uppercase tracking-[0.18em]" style={{ color: "rgba(64,43,36,0.6)" }}>
                    Open cart
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs" style={{ color: "rgba(64,43,36,0.5)" }}>
                One bouquet colour and one perfume scent per ticket — so we can prepare everything in advance.
              </p>
            </div>

            {/* Contact */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Email" required>
                <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className="craft-input" placeholder="you@email.com" />
              </Field>
              <Field label="Phone / WhatsApp" required>
                <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} className="craft-input" placeholder="+251 9XX XXX XXX" />
              </Field>
            </div>

            {/* Payment proof */}
            <div className="space-y-4 pt-2" style={{ borderTop: "1px solid rgba(64,43,36,0.1)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: "rgba(64,43,36,0.4)" }}>
                Payment proof — ticket ({totalDue.toLocaleString()} birr) <span style={{ color: "#A93A60" }}>*</span>
              </p>
              <p className="text-sm" style={{ color: "rgba(64,43,36,0.5)" }}>
                Transfer <strong style={{ color: "#A93A60" }}>{totalDue.toLocaleString()} birr</strong> to our account, then confirm below.
              </p>

              <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: "rgba(64,43,36,0.12)", backgroundColor: "rgba(64,43,36,0.03)" }}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: "rgba(64,43,36,0.45)" }}>
                  Payment accounts
                </p>
                <ul className="space-y-2" style={{ color: "rgba(64,43,36,0.7)" }}>
                  <li><strong style={{ color: "#A93A60" }}>CBE</strong> — Betselot Alemseged<br />1000348823594</li>
                  <li><strong style={{ color: "#A93A60" }}>Telebirr</strong> — Betselot<br />0945127874</li>
                </ul>
              </div>

              <div className="flex gap-2">
                {["screenshot", "link"].map((method) => (
                  <button key={method} type="button" onClick={() => set("payment_method", method)}
                    className="focus-craft flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-colors"
                    style={form.payment_method === method
                      ? { backgroundColor: "#A93A60", color: "#F8F3ED", border: "none" }
                      : { backgroundColor: "transparent", color: "rgba(64,43,36,0.55)", border: "1px solid rgba(64,43,36,0.18)" }
                    }
                  >
                    {method === "screenshot" ? <><ImageIcon className="h-4 w-4" /> Screenshot</> : <><Link2 className="h-4 w-4" /> Link / ID</>}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {form.payment_method === "link" ? (
                  <motion.div key="link" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <Field label="Payment link or transaction ID">
                      <input type="text" value={form.payment_link} onChange={(e) => set("payment_link", e.target.value)} className="craft-input" placeholder="Paste your payment reference or transaction ID" />
                    </Field>
                  </motion.div>
                ) : (
                  <motion.div key="screenshot" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <label className="focus-craft flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center transition-colors"
                      style={{ border: "1.5px dashed rgba(64,43,36,0.25)", backgroundColor: "rgba(64,43,36,0.03)" }}>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                      {uploading ? (
                        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#A93A60" }} />
                      ) : form.payment_screenshot_url ? (
                        <>
                          <Check className="h-6 w-6" style={{ color: "#A93A60" }} />
                          <span className="text-sm" style={{ color: "#402B24" }}>Screenshot uploaded ✓</span>
                          <span className="text-xs" style={{ color: "rgba(64,43,36,0.35)" }}>Click to replace</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-6 w-6" style={{ color: "rgba(64,43,36,0.4)" }} />
                          <span className="text-sm" style={{ color: "rgba(64,43,36,0.65)" }}>Upload payment screenshot</span>
                          <span className="text-xs" style={{ color: "rgba(64,43,36,0.35)" }}>PNG or JPG, up to 10 MB</span>
                        </>
                      )}
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notes */}
            <Field label="Notes (optional)">
              <textarea rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} className="craft-input resize-none" placeholder="Seating with friends, allergies to flowers or scents, anything else..." />
            </Field>

            {error && (
              <p className="rounded-xl px-4 py-3 text-sm" style={{ border: "1px solid rgba(169,58,96,0.4)", backgroundColor: "rgba(169,58,96,0.08)", color: "#A93A60" }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting}
              className="focus-craft flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl text-sm font-semibold uppercase tracking-[0.2em] transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#A93A60", color: "#F8F3ED" }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#8F2F52"; }}
              onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#A93A60"; }}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <><Heart className="h-4 w-4" fill="#F8F3ED" /> Confirm My Spot · {totalDue.toLocaleString()} birr</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: "rgba(64,43,36,0.4)" }}>
        {label} {required && <span style={{ color: "#A93A60" }}>*</span>}
      </span>
      {children}
    </label>
  );
}
