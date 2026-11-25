import React from "react";
import { MapPin, Clock, MessageCircle, Mail, Instagram, Heart, Phone, Coffee } from "lucide-react";
import { eventDetails, hosts } from "./packages";

const CORAL = "#A93A60";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden px-6 py-14 md:px-14" style={{ backgroundColor: "#F8F3ED", borderTop: "1px solid #EBCFCB" }}>
      <div className="lily-pattern-soft pointer-events-none absolute inset-0" style={{ opacity: 0.35 }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <img src="/floral/lily-rose.png" alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
              <h3 className="font-display text-3xl" style={{ color: "#402B24", fontWeight: 500 }}>Made by Me Crafts</h3>
            </div>
            <p className="max-w-xs text-sm leading-relaxed" style={{ color: "rgba(64,43,36,0.62)" }}>
              {eventDetails.tagline}. Every piece made by hand, made with love, made for you.
            </p>
            <p className="mt-3 text-xs" style={{ color: "rgba(64,43,36,0.45)" }}>Send inspo. We'll bring it to life. 💌</p>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: CORAL }}>The Details</p>
            <div className="space-y-3 text-sm" style={{ color: "rgba(64,43,36,0.72)" }}>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: CORAL }} />
                <span>{eventDetails.venue}<br />{eventDetails.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" style={{ color: CORAL }} />
                {eventDetails.date}
              </p>
              <p className="flex items-center gap-2">
                <Coffee className="h-4 w-4 shrink-0" style={{ color: CORAL }} />
                Tea by {eventDetails.drinkPartner}
              </p>
              <p className="flex items-center gap-2">
                <Heart className="h-4 w-4 shrink-0" style={{ color: CORAL }} />
                Guided by {hosts.map((h) => h.handle).join(" & ")}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: CORAL }}>Get in touch</p>
            <div className="flex flex-col gap-3">
              {[
                { href: eventDetails.instagramUrl, icon: Instagram, label: "Instagram • madebyme.4" },
                { href: eventDetails.telegram, icon: MessageCircle, label: "Telegram • @azagbrazm" },
                { href: `tel:${eventDetails.phone}`, icon: Phone, label: `Phone • ${eventDetails.phone}` },
                { href: `mailto:${eventDetails.email}`, icon: Mail, label: eventDetails.email },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm transition-colors"
                  style={{ color: "rgba(64,43,36,0.65)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = CORAL)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(64,43,36,0.65)")}
                >
                  <Icon className="h-4 w-4" style={{ color: CORAL }} /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row" style={{ borderTop: "1px solid #EBCFCB" }}>
          <p className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(64,43,36,0.5)" }}>
            <Heart className="h-3 w-3" style={{ color: CORAL }} fill={CORAL} />
            © {new Date().getFullYear()} Made by Me Crafts. All pieces made by hand.
          </p>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(64,43,36,0.45)" }}>
            {eventDetails.edition}
          </p>
        </div>
      </div>
    </footer>
  );
}
