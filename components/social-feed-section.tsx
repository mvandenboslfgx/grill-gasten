"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import { SOCIAL_FOOD_TILE_IDS, socialFoodTileUrl } from "@/lib/data/food-imagery";

const foodAlts = [
  "Sizzling smashburger met gesmolten kaas",
  "Loaded fries met vlees en toppings",
  "Knapperige kip of wings van de grill",
  "Sauzen en melted cheese close-up",
  "Premium smashburger — macro",
  "Gegrild vlees en streetfood van de grill",
  "Warme streetfood spread",
  "Verfrissend drankje bij de grill",
  "Knapperige snack met dip",
] as const;

export function SocialFeedSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-white/10 bg-[#080808] py-20 md:py-28">
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            align="center"
            eyebrow="Eten & drinken"
            title="Close-ups die honger maken"
            description="Alleen food & drinks in beeld — burgers, loaded fries, snacks en drank. Jullie eigen reels kunnen hier later live ingeladen worden."
          />
        </AnimatedContainer>

        <div className="columns-2 gap-3 sm:columns-3 lg:gap-4">
          {SOCIAL_FOOD_TILE_IDS.map((id, index) => (
            <motion.div
              key={`${id}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.04 }}
              className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-[#111] lg:mb-4"
            >
              <div className="relative">
                <Image
                  src={socialFoodTileUrl(id)}
                  alt={foodAlts[index] ?? "Grill Gasten streetfood"}
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="h-auto w-full object-cover"
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
