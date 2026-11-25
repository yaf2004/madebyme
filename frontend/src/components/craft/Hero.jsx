import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { eventDetails } from "./packages";

const MBM_LOGO = "/logos/mbm-logo.jpg";

const ABOUT_MBM =
  "Made by Me Crafts is a celebration of self-expression, creativity, and thoughtful gifting. From postcards, paper art, trinkets, drawings, and cute crafts to completely custom creations, every piece is handmade to tell a story and make someone feel loved—even on the most random days. Inspired by your memories, ideas, Pinterest boards, and little moments that matter, each piece is made to order and designed just for you.";

export default function Hero({ onReserve, onColours }) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(165deg, #F8F3ED 0%, #F1D7D6 34%, #E3C3BF 58%, #C3C7B9 100%)" }}
    >
      {/* Lily pattern background */}
      <div className="lily-pattern-white pointer-events-none absolute inset-0" style={{ opacity: 0.5 }} />

      {/* Big hero lilies */}
      <motion.img
        src="/floral/lily-rose.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute select-none"
        style={{ width: "min(46vw, 520px)", left: "-6vw", bottom: "-6%", opacity: 0.55, rotate: "-14deg" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.img
        src="/floral/lily-rose.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute select-none"
        style={{ width: "min(40vw, 440px)", right: "-5vw", top: "8%", opacity: 0.5, rotate: "28deg" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Soft vignette so text stays readable */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(248,243,237,0.65) 0%, rgba(248,243,237,0) 62%)" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-7 md:px-14 md:py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex items-center gap-3"
          >
            <div
              className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/40"
              style={{ border: "1.5px solid rgba(255,255,255,0.8)" }}
            >
              <img
                src={MBM_LOGO}
                alt="Made by Me Crafts"
                className="h-full w-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color: "#402B24" }}>
              Made by Me Crafts with Sene Tea
            </span>
          </motion.div>


        </div>

        {/* Centre */}
        <div className="flex flex-1 items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.55em]" style={{ color: "#A93A60" }}>
              Made by Me Workshop · Lily Edition
            </p>
            <h1
              className="font-display text-balance"
              style={{
                color: "#402B24",
                fontSize: "clamp(2.9rem, 9.5vw, 7.6rem)",
                fontWeight: 500,
                lineHeight: 0.98,
              }}
            >
              Make Your
              <br />
              <span style={{ fontStyle: "italic", color: "#A93A60" }}>Scented Bouquet</span>
            </h1>

            <div className="mx-auto my-7 flex items-center justify-center gap-4">
              <div className="h-px w-16" style={{ backgroundColor: "rgba(64,43,36,0.35)" }} />
              <img src="/floral/lily-rose.png" alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
              <div className="h-px w-16" style={{ backgroundColor: "rgba(64,43,36,0.35)" }} />
            </div>

            <p className="mx-auto max-w-md text-sm leading-relaxed md:text-base" style={{ color: "#402B24" }}>
              Lilies, peonies & a little perfume in the scent you pick — plus a miniature bouquet key chain to take home.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2" aria-hidden="true">
              {["#C94F78", "#EE90A7", "#EE8431", "#F6D5B2", "#EBCB6B", "#C3C7B9", "#7A5446"].map((c) => (
                <span key={c} className="h-4 w-4 rounded-full" style={{ backgroundColor: c, border: "1.5px solid rgba(255,255,255,0.8)" }} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div>
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="space-y-1 text-center md:text-left"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: "#A93A60" }}>
                {eventDetails.date}{eventDetails.time ? ` · ${eventDetails.time}` : ""}
              </p>
              <p className="text-base font-medium" style={{ color: "#402B24" }}>
                {eventDetails.venue}
              </p>
              <p className="text-sm" style={{ color: "rgba(64,43,36,0.8)" }}>
                Ticket:{" "}
                <strong style={{ color: "#A93A60" }}>
                  {eventDetails.entranceFee} {eventDetails.currency}
                </strong>{" "}
                · everything included
              </p>
            </motion.div>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
            <motion.button
              onClick={onColours}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              whileTap={{ scale: 0.97 }}
              className="focus-craft inline-flex items-center gap-3 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.55)", color: "#402B24", border: "1px solid rgba(64,43,36,0.35)" }}
            >
              Pick your colours
            </motion.button>
            <motion.button
              onClick={onReserve}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="focus-craft inline-flex items-center gap-3 px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] transition-colors"
              style={{ backgroundColor: "#A93A60", color: "#F8F3ED", border: "1px solid rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8F2F52")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#A93A60")}
            >
              Reserve Your Spot
              <ArrowDown className="h-4 w-4" />
            </motion.button>
            </div>
          </div>

          {/* About */}
          <div className="mt-8 md:hidden">
            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger asChild>
                <button
                  className="focus-craft inline-flex w-full items-center justify-between rounded-2xl border border-white/60 bg-white/40 px-5 py-4 text-sm font-semibold uppercase tracking-[0.25em] transition hover:bg-white/55"
                  style={{ color: "#402B24" }}
                  type="button"
                >
                  <span>About Made by Me</span>
                  <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(64,43,36,0.65)" }}>Show details</span>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="rounded-[24px] border border-white/60 bg-white/55 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em]" style={{ color: "#A93A60" }}>Made by Me Crafts</p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(64,43,36,0.8)" }}>{ABOUT_MBM}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="mx-auto mt-8 hidden max-w-4xl md:block">
            <div className="rounded-[24px] border border-white/60 bg-white/55 p-5 backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em]" style={{ color: "#A93A60" }}>Made by Me Crafts</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(64,43,36,0.8)" }}>{ABOUT_MBM}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
