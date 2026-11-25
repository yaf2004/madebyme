import React from "react";
import { motion } from "framer-motion";
import { ProductArt } from "./ColorArt";
import { bouquetColorways } from "./colorways";

const KEYCHAIN_IMG = "/colorways/keychain-soft-pink.webp";

// One combined card: the bouquet and key chain pictures sit together in a single panel.
export default function ActivityCard({ activity, index = 0 }) {
  const bouquet = bouquetColorways[0];
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="petal-card group relative grid overflow-hidden md:grid-cols-2"
    >
      <div
        className="relative flex min-h-[320px] items-center justify-center gap-2 overflow-hidden p-6 md:min-h-[420px]"
        style={{ background: `linear-gradient(160deg, ${activity.color}55 0%, #F4B58F33 100%)` }}
      >
        <div className="lily-pattern-soft absolute inset-0" />
        <ProductArt product="bouquet" colorway={bouquet}
          className="relative h-[82%] w-[56%] drop-shadow-lg transition-transform duration-700 group-hover:scale-105" />
        <ProductArt product="bouquet" colorway={{ ...bouquet, image: KEYCHAIN_IMG, name: "Flower key chain" }}
          className="relative h-[80%] w-[40%] drop-shadow-lg transition-transform duration-700 group-hover:scale-105" />
      </div>

      <div className="flex flex-col justify-center p-6 md:p-10">
        <h3 className="font-display text-3xl leading-tight md:text-4xl" style={{ color: "#402B24", fontWeight: 500 }}>
          {activity.name}
        </h3>
        <p className="mb-3 mt-1 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#A93A60" }}>
          {activity.tagline}
        </p>
        <p className="mb-5 text-sm leading-relaxed" style={{ color: "rgba(64,43,36,0.68)" }}>
          {activity.description}
        </p>
        <ul className="flex flex-wrap gap-2">
          {activity.makes.map((m) => (
            <li key={m} className="rounded-full px-3 py-1 text-[11px] font-medium"
              style={{ backgroundColor: `${activity.color}33`, color: "#402B24", border: `1px solid ${activity.color}` }}>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
