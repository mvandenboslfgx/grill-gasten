import type { Metadata } from "next";
import { AnimatedContainer } from "@/components/animated-container";
import { CTASection } from "@/components/cta-section";
import { FoodImage } from "@/components/food-image";
import { SectionTitle } from "@/components/section-title";
import { FOOD } from "@/lib/data/food-imagery";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Mike en Matthijs uit de Hoeksche Waard — Grill Gasten: premium smashburgers, loaded snacks en festival streetfood door heel Nederland.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-t border-white/10 bg-[#080808] pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6 lg:px-8">
          <AnimatedContainer>
            <SectionTitle
              eyebrow="Ons verhaal"
              title="Mike en Matthijs"
              description="Twee gasten uit de Hoeksche Waard met één drive: een foodtruck die kraakt van energie — smashburgers, loaded snacks en festival streetfood zonder saaie bedrijfstaal."
            />
            <div className="text-muted-foreground mt-6 space-y-4 text-sm leading-relaxed md:text-base">
              <p>
                Geen standaard burgers. Geen standaard snacks. Wel harde shifts, hete grill en gasten die terugkomen
                voor die ene cheese pull. Alles draait om smaak, kwaliteit en beleving: vers waar het kan, snel waar het
                moet — altijd met GG-attitude.
              </p>
              <p>
                Festivals, markten, bedrijfsfeesten en late-night spots — waar honger en sfeer samenkomen, rijden wij
                graag naartoe. Vanuit de Hoeksche Waard, voor heel Nederland.
              </p>
            </div>
          </AnimatedContainer>

          <AnimatedContainer delay={0.08} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_40px_120px_-40px_rgba(255,90,31,0.55)]">
              <FoodImage
                src={FOOD.smashHands.src}
                alt="Smashburger in handen — Grill Gasten streetfood"
                tier="featured"
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 480px, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
          </AnimatedContainer>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0a0a0a] py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <AnimatedContainer>
            <h2 className="font-heading text-center text-3xl uppercase tracking-wide text-white md:text-4xl">
              Founders
            </h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed">
              Het gezicht achter de grill — persoonlijk, ambitieus, festival-proof.
            </p>
          </AnimatedContainer>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <AnimatedContainer delay={0.05}>
              <article className="rounded-3xl border border-white/10 bg-[#111] p-8 text-center md:text-left">
                <p className="text-primary text-xs font-semibold uppercase tracking-[0.35em]">Co-founder</p>
                <h3 className="font-heading mt-2 text-4xl uppercase tracking-wide text-white">Mike</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Operatie en grill — tempo, kwaliteit en een crew die elke shift scherp blijft.
                </p>
              </article>
            </AnimatedContainer>
            <AnimatedContainer delay={0.1}>
              <article className="rounded-3xl border border-white/10 bg-[#111] p-8 text-center md:text-left">
                <p className="text-primary text-xs font-semibold uppercase tracking-[0.35em]">Co-founder</p>
                <h3 className="font-heading mt-2 text-4xl uppercase tracking-wide text-white">Matthijs</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Merk en events — van menu tot sfeer: alles moet kloppen als de rij lang wordt.
                </p>
              </article>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080808] py-16 md:py-24">
        <div className="mx-auto max-w-6xl space-y-10 px-4 md:px-6 lg:px-8">
          <AnimatedContainer>
            <SectionTitle
              align="center"
              eyebrow="Waar we voor staan"
              title="Smaak. Kwaliteit. Beleving."
              description="Geen standaard foodtruck — eigen energie, premium smash en loaded classics die je wilt vastleggen."
            />
          </AnimatedContainer>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Geen standaard truck",
                body: "Geen standaard menu. Gewoon hard gaan — loaded specials en smash die kraakt.",
              },
              {
                title: "Festival DNA",
                body: "Queues die bewegen, trays die glanzen — built voor drukte zonder in te leveren op smaak.",
              },
              {
                title: "Hoeksche Waard → NL",
                body: "Thuisbasis in de Hoeksche Waard. Inzetbaar waar jouw crowd wacht.",
              },
            ].map((item, index) => (
              <AnimatedContainer key={item.title} delay={index * 0.06}>
                <article className="h-full rounded-3xl border border-white/10 bg-[#111] p-8">
                  <h3 className="font-heading text-2xl tracking-wide text-white uppercase">{item.title}</h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.body}</p>
                </article>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Boek ons voor je volgende event."
        description="Mike en Matthijs — snelste lijn: WhatsApp. Voor een uitgewerkte offerte: cateringformulier."
        primaryHref="/catering"
        primaryLabel="Catering"
        secondaryHref={getWhatsAppHref("about")}
        secondaryLabel="WhatsApp"
        tertiaryHref="/contact"
        tertiaryLabel="Contact"
      />
    </>
  );
}
