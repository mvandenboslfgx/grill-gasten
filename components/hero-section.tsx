"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { GlowButton } from "@/components/button";
import { IMG_HERO_BURGER } from "@/lib/data/food-imagery";
import { site } from "@/lib/site";

const burgerSrc = IMG_HERO_BURGER;

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 20,
  });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.set(x * 0.35);
      my.set(y * 0.35);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduceMotion]);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#050505]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,90,31,0.35),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_45%),linear-gradient(180deg,#0a0a0a_0%,#050505_55%,#0a0a0a_100%)]"
      />
      <div
        aria-hidden
        className="animate-smoke pointer-events-none absolute -inset-[20%] opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.22), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col gap-10 px-4 pb-16 pt-28 md:flex-row md:items-center md:px-6 lg:gap-16 lg:px-8">
        <div className="max-w-xl space-y-8 md:flex-1">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-primary text-xs font-semibold uppercase tracking-[0.45em]"
          >
            {site.founders} · {site.region}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-5xl leading-[0.92] tracking-wide text-white uppercase sm:text-6xl md:text-7xl lg:text-[4.75rem]"
          >
            Loaded.
            <br />
            Gegrild.
            <br />
            <span className="text-gradient-silver">Legendarisch.</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="text-muted-foreground text-lg leading-relaxed md:text-xl"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <GlowButton href="/menu" variant="flame">
              Bekijk menu
            </GlowButton>
            <GlowButton href="/catering" variant="outline">
              Boek ons
            </GlowButton>
          </motion.div>
        </div>

        <div className="relative flex flex-1 items-center justify-center md:justify-end" style={{ perspective: 1200 }}>
          <div className="relative aspect-square w-full max-w-md md:max-w-lg">
            <motion.div
              style={{
                rotateX: reduceMotion ? 0 : rotateX,
                rotateY: reduceMotion ? 0 : rotateY,
                transformPerspective: 1200,
                transformStyle: "preserve-3d",
              }}
              className="relative h-full w-full"
            >
              <div className="absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/40 via-white/10 to-transparent blur-3xl" />
              <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111] shadow-[0_40px_120px_-40px_rgba(255,90,31,0.65)]">
                <Image
                  src={burgerSrc}
                  alt="Close-up van een premium smashburger met gesmolten kaas"
                  fill
                  priority
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
