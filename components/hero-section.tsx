"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { GlowButton } from "@/components/button";
import { PhoneLink } from "@/components/phone-link";
import { FoodImage } from "@/components/food-image";
import { FOOD, IMG_FOOD_TRUCK } from "@/lib/data/food-imagery";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

const HERO_FOREGROUND = FOOD.smashHands;
const HERO_MOBILE_BG = FOOD.smashHands;

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100dvh] min-h-[100svh] flex-col justify-end overflow-hidden bg-[#030303]"
    >
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { y: bgY, scale: bgScale }}
      >
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={IMG_FOOD_TRUCK}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 md:hidden">
          <FoodImage
            src={HERO_MOBILE_BG.src}
            alt=""
            tier="hero"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_22%] scale-110"
            aria-hidden
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_30%,rgba(255,90,31,0.22),transparent_55%)]"
        />
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-[#050505]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(255,90,31,0.35),transparent_60%)]"
      />
      <div
        aria-hidden
        className="animate-smoke pointer-events-none absolute -inset-[25%] opacity-30 mix-blend-screen"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.2), transparent 70%)",
        }}
      />
      <motion.div
        style={reduceMotion ? undefined : { y: contentY }}
        className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 pb-36 pt-28 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:px-6 md:pb-28 md:pt-32 lg:px-8"
      >
        <div className="max-w-2xl space-y-6 md:space-y-8">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-primary text-[10px] font-semibold uppercase tracking-[0.5em] sm:text-xs"
          >
            {site.founders} · {site.region}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.88] tracking-wide text-white uppercase"
          >
            De premium
            <br />
            BBQ foodtruck
            <br />
            <span className="text-gradient-silver">Voor elk moment.</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="text-muted-foreground max-w-lg text-base leading-relaxed md:text-xl"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <GlowButton href="/catering#booking" variant="flame" className="w-full sm:w-auto">
              Boek direct
            </GlowButton>
            <GlowButton href={getWhatsAppHref("home")} variant="outline" className="w-full sm:w-auto">
              WhatsApp
            </GlowButton>
            <PhoneLink
              showIcon
              className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white sm:w-auto"
            />
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden aspect-[4/5] max-h-[min(72vh,640px)] w-full justify-self-end overflow-hidden rounded-[2rem] border border-white/15 shadow-[0_48px_140px_-48px_rgba(255,90,31,0.7)] md:block"
        >
          <div className="absolute inset-4 rounded-[1.75rem] bg-gradient-to-br from-primary/50 via-transparent to-transparent blur-2xl" />
          <FoodImage
            src={HERO_FOREGROUND.src}
            alt="Premium smashburger — Grill Gasten signature"
            tier="hero"
            fill
            priority
            sizes="(min-width: 768px) 480px, 0px"
            className="object-cover object-center transition duration-700 hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-28 left-1/2 z-10 hidden -translate-x-1/2 md:bottom-10 md:block"
      >
        <span className="block h-10 w-px bg-gradient-to-b from-transparent via-primary/80 to-transparent" />
      </motion.div>
    </section>
  );
}
