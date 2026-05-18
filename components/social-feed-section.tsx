"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedContainer } from "@/components/animated-container";
import { FoodImage } from "@/components/food-image";
import { SectionTitle } from "@/components/section-title";
import { SOCIAL_FOOD_TILES } from "@/lib/data/food-imagery";

export function SocialFeedSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-white/10 bg-[#080808] py-20 md:py-28">
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            align="center"
            eyebrow="Gallery"
            title="Premium BBQ in beeld"
            description="Echte visuals — smash, loaded trays en festival energy. Geen stock, wel GG."
          />
        </AnimatedContainer>

        <div className="columns-2 gap-3 sm:columns-3 lg:gap-4">
          {SOCIAL_FOOD_TILES.map((tile, index) => (
            <motion.div
              key={`${tile.src}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.04 }}
              className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-[#111] lg:mb-4"
            >
              <div className="relative">
                <FoodImage
                  src={tile.src}
                  alt={tile.alt}
                  width={tile.width}
                  height={tile.height}
                  tier="featured"
                  loading="lazy"
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
