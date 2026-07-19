"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { PhoneLink } from "@/components/phone-link";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

const eventTypes = [
  "Bedrijfsmomenten",
  "Bruiloften",
  "Privéfeesten",
  "Groepen",
] as const;

export function PremiumBookingCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-[#080808] py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(255,90,31,0.22),transparent_60%)]"
      />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6 lg:px-8">
        <AnimatedContainer>
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.4em]">Boek nu</p>
          <h2 className="font-heading mt-4 text-[clamp(2rem,6vw,3.75rem)] leading-[0.95] tracking-wide text-white uppercase">
            Klaar om jouw gelegenheid
            <span className="text-gradient-silver block">met Grill Gasten te vieren?</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-sm leading-relaxed md:text-base">
            Vraag vrijblijvend wat mogelijk is — populaire data gaan snel, dus check op tijd.
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={0.08} className="mt-10">
          <ul className="mx-auto grid max-w-md gap-3 text-left sm:grid-cols-2">
            {eventTypes.map((label) => (
              <li key={label} className="premium-check-item flex items-center gap-3 text-sm text-white/90">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                  <Check className="size-4" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </AnimatedContainer>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center"
        >
          <GlowButton href="/catering#booking" variant="flame" className="w-full sm:w-auto">
            Vraag offerte aan
          </GlowButton>
          <GlowButton href={getWhatsAppHref("catering")} variant="outline" className="w-full sm:w-auto">
            WhatsApp direct
          </GlowButton>
          <PhoneLink className="text-muted-foreground text-sm font-medium tracking-wide hover:text-white" />
        </motion.div>

        <p className="text-muted-foreground mt-6 text-xs font-medium uppercase tracking-[0.2em]">
          {site.founders} · meestal reactie dezelfde dag
        </p>
      </div>
    </section>
  );
}
