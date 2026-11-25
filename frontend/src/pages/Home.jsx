import React from "react";
import Hero from "@/components/craft/Hero";
import CraftCurriculum from "@/components/craft/CraftCurriculum";
import RSVPForm from "@/components/craft/RSVPForm";
import SiteFooter from "@/components/craft/SiteFooter";
import { CartProvider } from "@/components/craft/CartContext";
import CartDrawer, { CartButton } from "@/components/craft/CartDrawer";

export default function Home() {
  const scrollTo = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <CartProvider>
      <main style={{ backgroundColor: "#F8F3ED" }}>
        <Hero onReserve={scrollTo("rsvp")} onColours={scrollTo("colours")} />
        <CraftCurriculum onReserve={scrollTo("rsvp")} />
        <RSVPForm />
        <SiteFooter />
      </main>
      <CartButton />
      <CartDrawer />
    </CartProvider>
  );
}
