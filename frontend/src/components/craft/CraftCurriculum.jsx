import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ActivityCard from "./ActivityCard";
import ColorPicker from "./ColorPicker";
import { activities, experience, ticketIncludes, takeHome, takeHomeImage, hosts, eventDetails } from "./packages";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

function SectionHeader({ eyebrow, title, children, light }) {
  return (
    <motion.div {...fadeUp} className="mb-12 text-center">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.45em]" style={{ color: light ? "#402B24" : "#A93A60" }}>
        {eyebrow}
      </p>
      <h2
        className="font-display leading-[1.05]"
        style={{ color: light ? "#402B24" : "#402B24", fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)", fontWeight: 500 }}
      >
        {title}
      </h2>
      {children && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed" style={{ color: light ? "rgba(64,43,36,0.8)" : "rgba(64,43,36,0.65)" }}>
          {children}
        </p>
      )}
    </motion.div>
  );
}

export default function CraftCurriculum({ onReserve }) {
  return (
    <>
      {/* ── What you will make ── */}
      <section id="crafts" className="relative px-6 py-20 md:px-14 md:py-28" style={{ backgroundColor: "#F8F3ED" }}>
        <div className="lily-pattern-soft pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl">
          <SectionHeader eyebrow="What you will make" title={<>Two blooms, <em>one workshop</em></>}>
            Everything is guided, hands-on and beginner friendly. You'll make the bouquet and the key chain in one relaxed session.
          </SectionHeader>

          <div className="grid gap-8">
            {activities.map((a, i) => (
              <ActivityCard key={a.id} activity={a} index={i} />
            ))}
          </div>

          {/* Guided by */}
          <motion.div {...fadeUp} className="mt-14 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.45em]" style={{ color: "rgba(64,43,36,0.55)" }}>
              Guided by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {hosts.map((h) => (
                <a
                  key={h.handle}
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-craft font-display rounded-full px-6 py-2.5 text-xl transition-colors"
                  style={{ backgroundColor: "#FFFFFF", color: "#A93A60", border: "1.5px solid #EBCFCB", fontStyle: "italic" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F1D7D6")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                >
                  {h.handle}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pick your colours (carousels + cart) ── */}
      <ColorPicker onReserve={onReserve} />

      {/* ── Enjoy the experience ── */}
      <section
        className="relative overflow-hidden px-6 py-20 md:px-14 md:py-28"
        style={{ background: "linear-gradient(170deg, #C3C7B9 0%, #AEB5A0 100%)" }}
      >
        <div className="lily-pattern-white pointer-events-none absolute inset-0" style={{ opacity: 0.3 }} />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeader eyebrow="Enjoy the experience" title={<>Come bloom <em>with us</em></>} light />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {experience.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="flex flex-col items-center gap-2 rounded-2xl p-6 text-center"
                style={{ backgroundColor: "rgba(248,243,237,0.94)" }}
              >
                <span style={{ fontSize: "1.9rem" }}>{item.icon}</span>
                <p className="font-display text-xl font-medium" style={{ color: "#402B24" }}>{item.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(64,43,36,0.62)" }}>{item.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ticket ── */}
      <section className="px-6 py-20 md:px-14 md:py-28" style={{ backgroundColor: "#F8F3ED" }}>
        <div className="mx-auto max-w-4xl">
          <SectionHeader eyebrow="Your ticket" title={<>One ticket, <em>everything included</em></>} />

          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-[28px] p-8 text-center md:p-12"
            style={{ backgroundColor: "#FFFFFF", border: "1.5px solid #EBCFCB", boxShadow: "0 10px 40px rgba(169,58,96,0.13)" }}
          >
            <img
              src="/floral/lily-rose.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 w-44 opacity-20"
              style={{ rotate: "24deg" }}
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: "#A93A60" }}>
              {eventDetails.date}
            </p>
            <p className="mt-1 text-xs" style={{ color: "rgba(64,43,36,0.6)" }}>
              {eventDetails.venue}{eventDetails.time ? ` · ${eventDetails.time}` : ""} · per person
            </p>
            <p className="font-display mt-4 text-6xl" style={{ color: "#402B24", fontWeight: 500 }}>
              {eventDetails.entranceFee.toLocaleString()} <span className="text-2xl" style={{ color: "rgba(64,43,36,0.55)" }}>{eventDetails.currency}</span>
            </p>

            <p className="mt-3 text-sm" style={{ color: "rgba(64,43,36,0.7)" }}>
              Everything included — the activities, refreshment, and a blind gift.
            </p>

            <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
              {ticketIncludes.map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm" style={{ color: "rgba(64,43,36,0.8)" }}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#8E9A82" }}>
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <button
              onClick={onReserve}
              className="focus-craft mt-10 inline-flex items-center justify-center px-9 py-4 text-sm font-medium uppercase tracking-[0.22em] transition-colors"
              style={{ backgroundColor: "#A93A60", color: "#F8F3ED" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8F2F52")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#A93A60")}
            >
              Reserve Your Spot
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── What you leave with ── */}
      <section className="relative overflow-hidden px-6 py-20 md:px-14 md:py-28" style={{ backgroundColor: "#402B24" }}>
        <div className="lily-pattern-white pointer-events-none absolute inset-0" style={{ opacity: 0.07 }} />
        <div className="relative mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.45em]" style={{ color: "#EE90A7" }}>So you're leaving with</p>
            <h2 className="font-display leading-[1.05]" style={{ color: "#F8F3ED", fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)", fontWeight: 500 }}>
              Something <em>made by you</em>
            </h2>
          </motion.div>

          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mx-auto w-full max-w-md overflow-hidden rounded-[28px]"
              style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.35)", border: "1px solid rgba(248,243,237,0.15)" }}
            >
              <img
                src={takeHomeImage}
                alt="What you take home: a flower bouquet, a mini perfume, a flower key chain and a blind gift"
                className="block h-auto w-full"
                style={{ aspectRatio: "4 / 5", objectFit: "cover" }}
              />
            </motion.div>

            <ul className="space-y-4">
              {takeHome.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex items-center gap-4 rounded-2xl p-4"
                  style={{ backgroundColor: "rgba(248,243,237,0.07)", border: "1px solid rgba(248,243,237,0.14)" }}
                >
                  <span
                    className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl"
                    style={{ backgroundColor: ["#EE90A7", "#C3C7B9", "#F6D5B2", "#EBCB6B"][i % 4], color: "#402B24", fontStyle: "italic" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-2xl leading-tight" style={{ color: "#F8F3ED", fontWeight: 500 }}>{item.name}</p>
                    <p className="mt-0.5 text-sm leading-relaxed" style={{ color: "rgba(248,243,237,0.72)" }}>{item.note}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
