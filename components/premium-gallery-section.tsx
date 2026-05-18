"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedContainer } from "@/components/animated-container";
import { FoodImage } from "@/components/food-image";
import { SectionTitle } from "@/components/section-title";
import { GALLERY_CATEGORIES } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";

export function PremiumGallerySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-white/10 bg-[#050505] py-20 md:py-28" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-6xl space-y-20 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            id="gallery-heading"
            align="center"
            eyebrow="Beleving"
            title="Zo voelt Grill Gasten live"
            description="Echte beelden — vier werelden: vuur, signature burgers, festival en privé."
          />
        </AnimatedContainer>

        {GALLERY_CATEGORIES.map((category, catIndex) => (
          <AnimatedContainer key={category.id} delay={catIndex * 0.06} className="space-y-6">
            <div className="flex flex-col gap-2 border-l-2 border-primary pl-5 md:flex-row md:items-end md:justify-between md:pl-6">
              <div>
                <p className="text-primary text-[10px] font-semibold uppercase tracking-[0.45em]">
                  {category.label}
                </p>
                <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed md:text-base">
                  {category.tagline}
                </p>
              </div>
            </div>
            <div
              className={cn(
                "grid gap-3",
                category.tiles.length >= 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2",
              )}
            >
              {category.tiles.map((tile, tileIndex) => (
                <motion.figure
                  key={`${category.id}-${tile.src}-${tileIndex}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: tileIndex * 0.05 }}
                  className="premium-media-card group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[#111] sm:aspect-[3/4]"
                >
                  <FoodImage
                    src={tile.src}
                    alt={tile.alt}
                    tier="featured"
                    loading="lazy"
                    fill
                    sizes="(min-width: 1024px) 400px, 50vw"
                    className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-90 transition group-hover:from-black/85" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/90">
                      {category.label}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </AnimatedContainer>
        ))}
      </div>
    </section>
  );
}
