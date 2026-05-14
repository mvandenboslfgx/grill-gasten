"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GlowButton } from "@/components/button";
import { cn } from "@/lib/utils";

type CTASectionProps = {
  title: string;
  description?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Derde CTA (bijv. Contact-pagina naast WhatsApp + catering) */
  tertiaryHref?: string;
  tertiaryLabel?: string;
  className?: string;
};

export function CTASection({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  tertiaryHref,
  tertiaryLabel,
  className,
}: CTASectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-t border-white/10 bg-[#050505] py-16 md:py-24",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,90,31,0.32),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_50%)]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-24 opacity-35 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: [0, 6, -4, 0],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "conic-gradient(from 180deg, rgba(255,90,31,0.5), transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-stretch gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          <h2 className="font-heading text-4xl leading-[0.92] tracking-[0.04em] text-white uppercase sm:text-5xl md:text-6xl">
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground text-base leading-relaxed md:text-lg">{description}</p>
          ) : null}
        </div>
        <div className="flex w-full flex-col gap-3 sm:max-w-md sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
          <GlowButton href={primaryHref} variant="flame">
            {primaryLabel}
          </GlowButton>
          {secondaryHref && secondaryLabel ? (
            <GlowButton href={secondaryHref} variant="outline">
              {secondaryLabel}
            </GlowButton>
          ) : null}
          {tertiaryHref && tertiaryLabel ? (
            <GlowButton href={tertiaryHref} variant="outline" className="border-primary/35">
              {tertiaryLabel}
            </GlowButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}
