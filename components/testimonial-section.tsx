"use client";

import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import { testimonials } from "@/lib/data/testimonials";

export function TestimonialSection() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] py-20 md:py-28">
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            align="center"
            eyebrow="Ervaringen"
            title="Waar we voor staan"
            description="Korte impressies van events en catering — echte feedback van opdrachtgevers en locaties."
          />
        </AnimatedContainer>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <AnimatedContainer key={t.id} delay={index * 0.06}>
              <figure className="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#141414] to-[#0d0d0d] p-8 shadow-[0_24px_70px_-45px_rgba(255,90,31,0.25)]">
                <blockquote className="flex-1">
                  <p className="text-base leading-relaxed text-white md:text-lg">&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">{t.context}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{t.attribution}</p>
                </figcaption>
              </figure>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
