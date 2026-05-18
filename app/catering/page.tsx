import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { AnimatedContainer } from "@/components/animated-container";
import { CTASection } from "@/components/cta-section";
import { SectionTitle } from "@/components/section-title";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CateringBookingForm } from "@/features/forms/catering-booking-form";
import { cateringFaqs, cateringPackages } from "@/lib/data/catering";
import { GlowButton } from "@/components/button";
import { TrustStrip } from "@/components/trust-strip";
import { PhoneLink } from "@/components/phone-link";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { IMG_FOOD_TRUCK } from "@/lib/data/food-imagery";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Grill Gasten op jouw event — festivals, bedrijfsfeesten, sportevents en meer. Premium streetfood en foodtruck door heel Nederland.",
};

const heroImage = IMG_FOOD_TRUCK;

const heroContextTags = [
  "Festivals",
  "Bedrijfsfeesten",
  "Sportclubs",
  "Verjaardagen",
  "Openingen",
] as const;

const eventImpressiePoints = [
  "Snelle service",
  "Premium kwaliteit",
  "Door heel Nederland",
  "Festivals & catering",
  "Flexibel inzetbaar",
] as const;

const inzetbaarVoor = [
  "Festivals",
  "Bedrijfsfeesten",
  "Markten",
  "Sportevents",
  "Schoolfeesten",
  "Bruiloften",
  "Late night",
] as const;

export default function CateringPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-t border-white/10 pt-24 sm:pt-28 md:pt-32">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Foodtruck met streetfood en catering voor events"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/88 to-black/50" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_20%,rgba(255,90,31,0.18),transparent_55%)]" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 md:flex-row md:items-stretch md:justify-between md:gap-12 md:px-6 md:py-28 lg:px-8">
          <div className="max-w-xl space-y-6 md:py-1">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.42em]">
              Premium streetfood · Mike en Matthijs
            </p>
            <h1 className="font-heading text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] tracking-[0.03em] text-white uppercase">
              Premium streetfood
              <span className="mt-1 block text-white/95">Voor jouw event</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
              Truck op locatie, smash die kraakt, rijen die doorlopen — gebouwd voor drukte zonder in te leveren op smaak.
            </p>
            <div className="flex flex-wrap gap-2">
              {heroContextTags.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-white/80">
              Datum onder druk?{" "}
              <span className="text-primary">App ons direct</span> — Mike en Matthijs reageren meestal dezelfde dag.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <GlowButton href={getWhatsAppHref("catering")} variant="flame">
                WhatsApp
              </GlowButton>
              <PhoneLink
                showIcon
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:border-primary/40"
              />
              <GlowButton href="#booking" variant="outline">
                Offerte aanvragen
              </GlowButton>
            </div>
          </div>
          <aside className="w-full max-w-sm shrink-0 self-stretch md:max-w-[22rem]">
            <div className="flex h-full flex-col rounded-3xl border border-primary/25 bg-black/55 p-6 shadow-[0_0_0_1px_rgba(255,90,31,0.12),0_28px_80px_-28px_rgba(255,90,31,0.45)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Event impressie</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Wat je kunt verwachten als wij de lane openen — strak, snel, premium.
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-3.5 text-sm text-white">
                {eventImpressiePoints.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
                      <Check className="size-3 text-primary" strokeWidth={2.5} aria-hidden />
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed">
                Echte reviews volgen — nu alles op beleving, kwaliteit en herkenning.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0a0a0a] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <AnimatedContainer>
            <h2 className="font-heading text-3xl uppercase tracking-wide text-white md:text-4xl">
              Waar we inzetbaar zijn
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
              Herken je eigen crowd? Dan past Grill Gasten waarschijnlijk ook. Van festivalterrein tot clubavond — wij
              schalen mee met {site.founders}.
            </p>
          </AnimatedContainer>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <AnimatedContainer delay={0.05}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Segmenten</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {inzetbaarVoor.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/12 bg-[#111] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/90"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
                Ook voor openingen, verjaardagen, late night en privé-events —{" "}
                <a href="#booking" className="text-primary underline-offset-4 hover:underline">
                  vertel je wensen
                </a>{" "}
                in het formulier.
              </p>
            </AnimatedContainer>
            <AnimatedContainer delay={0.1}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Wij verzorgen</h3>
              <ul className="text-muted-foreground mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed">
                <li>Smashburgers</li>
                <li>Loaded fries</li>
                <li>Snacks</li>
                <li>Streetfood specials</li>
                <li>Snelle service</li>
                <li>Volledige foodtruckbeleving</li>
              </ul>
            </AnimatedContainer>
          </div>
          <AnimatedContainer delay={0.12} className="mt-10">
            <TrustStrip />
          </AnimatedContainer>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080808] py-16 md:py-24">
        <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6 lg:px-8">
          <AnimatedContainer>
            <SectionTitle
              align="center"
              eyebrow="Pakketten"
              title="Kies je setup"
              description="Mike en Matthijs schalen mee — van compacte street setup tot volledige festivalopstelling."
            />
          </AnimatedContainer>

          <div className="grid gap-6 md:grid-cols-3">
            {cateringPackages.map((pkg, index) => (
              <AnimatedContainer key={pkg.id} delay={index * 0.06}>
                <Card className="h-full border-white/10 bg-[#111] shadow-[0_24px_70px_-40px_rgba(255,90,31,0.35)]">
                  <CardHeader className="space-y-2">
                    <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em]">
                      {pkg.priceFrom}
                    </p>
                    <h2 className="font-heading text-3xl tracking-wide text-white uppercase">{pkg.name}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">{pkg.blurb}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {pkg.perks.map((perk) => (
                        <li key={perk} className="flex gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <GlowButton href="#booking" variant="outline">
                      Kies {pkg.name}
                    </GlowButton>
                  </CardFooter>
                </Card>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="border-t border-white/10 bg-[#0a0a0a] py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:px-6 lg:px-8">
          <AnimatedContainer>
            <SectionTitle
              eyebrow="Boeking"
              title="Zet de datum vast"
              description="Vertel ons wat je bouwt — wij komen terug met een scherp voorstel en duidelijke volgende stappen."
            />
          </AnimatedContainer>
          <AnimatedContainer delay={0.08}>
            <div className="rounded-3xl border border-white/10 bg-[#111] p-6 md:p-8">
              <CateringBookingForm />
            </div>
          </AnimatedContainer>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080808] py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-8 px-4 md:px-6 lg:px-8">
          <AnimatedContainer>
            <SectionTitle align="center" eyebrow="FAQ" title="Alles wat je wilt weten" />
          </AnimatedContainer>
          <AnimatedContainer delay={0.06}>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {cateringFaqs.map((item, index) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${index}`}
                  className="rounded-2xl border border-white/10 bg-[#111] px-4"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedContainer>
        </div>
      </section>

      <CTASection
        title="Wil je meteen sparren?"
        description="WhatsApp voor snelle beschikbaarheid — cateringformulier voor een uitgewerkte offerte."
        primaryHref={getWhatsAppHref("catering")}
        primaryLabel="WhatsApp Mike en Matthijs"
        secondaryHref="/catering#booking"
        secondaryLabel="Naar formulier"
        tertiaryHref="/contact"
        tertiaryLabel="Contactpagina"
      />
    </>
  );
}
