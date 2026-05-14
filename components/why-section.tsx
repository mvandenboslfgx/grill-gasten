"use client";

import { Flame, Sparkles, Truck } from "lucide-react";
import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";

const items = [
  {
    title: "Verse smashburgers",
    body: "Vers van de grill, loaded toppings, signature sauzen — smaak en kwaliteit voorop.",
    icon: Flame,
  },
  {
    title: "Festival-ready",
    body: "Snelle service, complete foodtruck experience — waar honger en sfeer samenkomen.",
    icon: Truck,
  },
  {
    title: "Premium streetfood",
    body: "Geen standaard foodtruck. Wel streetfood met attitude — van markt tot mainstage.",
    icon: Sparkles,
  },
] as const;

export function WhySection() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] py-20 md:py-28">
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            align="center"
            eyebrow="Waarom GG"
            title="Voor echte gasten"
            description="Opgericht door Mike en Matthijs: passie voor goed eten, festivals en echte streetfood cultuur — uit de Hoeksche Waard, inzetbaar door heel Nederland."
          />
        </AnimatedContainer>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <AnimatedContainer key={item.title} delay={index * 0.08}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#151515] to-[#0d0d0d] p-8 shadow-[0_30px_80px_-40px_rgba(255,90,31,0.35)] transition hover:border-primary/40">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary transition group-hover:bg-primary/10">
                  <item.icon className="size-6" aria-hidden />
                </div>
                <h3 className="font-heading text-2xl tracking-wide text-white uppercase">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {item.body}
                </p>
              </article>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
