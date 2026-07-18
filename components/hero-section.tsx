"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GlowButton } from "@/components/button";
import { FOOD } from "@/lib/data/food-imagery";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

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
        <Image
          src={FOOD.smashHands.src}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/75 to-[#030303]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/90 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-32 md:px-6 md:pb-32 lg:px-8"
        style={reduceMotion ? undefined : { y: contentY }}
      >
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.32em]">{site.name}</p>
        <h1 className="font-heading mt-4 max-w-3xl text-4xl uppercase leading-[0.95] tracking-wide text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Smashburgers waar je voor terugkomt.
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
          Verse smashburgers, loaded fries en spicy chicken. Snel besteld, heet bereid en vol smaak.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <GlowButton href="/bestellen" variant="flame" className="min-h-12">
            Bestel nu
          </GlowButton>
          <GlowButton href="/menu" variant="outline" className="min-h-12">
            Bekijk menu
          </GlowButton>
          <GlowButton href={getWhatsAppHref("home")} variant="outline" className="min-h-12">
            WhatsApp
          </GlowButton>
        </div>
      </motion.div>
    </section>
  );
}
