"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { featuredHighlights } from "@/lib/data/menu";
import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import { cn } from "@/lib/utils";

export function FeaturedFoodSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-white/10 bg-[#080808] py-20 md:py-28">
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            eyebrow="Signature"
            title="Food die cravings triggert"
            description="Smash, loaded trays, melted cheese, crispy bites — warm, juicy, high contrast. Straks: jullie eigen shoots i.p.v. stock."
          />
        </AnimatedContainer>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredHighlights.map((item, index) => (
            <AnimatedContainer key={item.title} delay={index * 0.06}>
              <motion.article
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -6, rotate: index % 2 === 0 ? -0.6 : 0.6 }
                }
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111]",
                  "shadow-[0_18px_60px_-30px_rgba(0,0,0,0.9)]",
                )}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={item.image}
                    alt={`Grill Gasten — ${item.title.toLowerCase()}`}
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                <div className="space-y-2 p-6">
                  <h3 className="font-heading text-2xl tracking-wide text-white uppercase">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
