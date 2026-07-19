"use client";

import { FoodImage } from "@/components/food-image";
import { FOOD } from "@/lib/data/food-imagery";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import { GlowButton } from "@/components/button";

export function FestivalExperienceSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[420px] overflow-hidden border-t border-white/10 py-24 md:min-h-[520px] md:py-32">
      <div className="absolute inset-0">
        <FoodImage
          src={FOOD.loadedTray.src}
          alt="Streetfood van de grill — close-up eten en warme sfeer"
          tier="featured"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,90,31,0.35),transparent_55%)] mix-blend-screen" />
      <div
        aria-hidden
        className="animate-smoke pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.25), transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-end md:justify-between md:px-6 lg:px-8">
        <AnimatedContainer className="max-w-xl space-y-6">
          <SectionTitle
            eyebrow="Van de grill"
            title="Van de grill. Op je bord."
            description="Close-ups van smash, loaded trays en saus die blijft plakken — smaak en tempo voorop."
          />
        </AnimatedContainer>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4 md:items-end"
        >
          <p className="text-right text-sm text-muted-foreground md:max-w-xs">
            Premium presentatie, grillmarks en loaded classics.
          </p>
          <GlowButton href="/menu" variant="flame">
            Bekijk menu
          </GlowButton>
        </motion.div>
      </div>
    </section>
  );
}
