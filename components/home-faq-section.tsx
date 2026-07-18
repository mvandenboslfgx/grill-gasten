"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedContainer } from "@/components/animated-container";
import { FaqContactCta } from "@/components/faq-contact-cta";
import { ALLERGEN_NOTICE } from "@/lib/catalog/products";

const faqs = [
  {
    q: "Hoe plaats ik een bestelling?",
    a: "Ga naar Bestellen, kies je gerechten, kies afhalen of bezorgen, selecteer een beschikbaar moment en betaal veilig online.",
  },
  {
    q: "Kan ik laten bezorgen?",
    a: "Ja, we bezorgen in de hele Hoeksche Waard tot maximaal 25 km vanaf Klaaswaal. Bezorgkosten en minimum bestelling hangen af van je zone.",
  },
  {
    q: "In welke plaatsen bezorgen jullie?",
    a: "In de Hoeksche Waard, zolang je adres binnen 25 km enkele reis vanaf Klaaswaal ligt. Tiengemeten alleen in overleg via WhatsApp.",
  },
  {
    q: "Wat zijn de bezorgkosten?",
    a: "Vanaf €2,99 tot €12,49, afhankelijk van de afstand. De exacte zone zie je na het controleren van je postcode en huisnummer.",
  },
  {
    q: "Waarom geldt een minimum bestelbedrag?",
    a: "Verder weg rijden kost meer tijd en brandstof. Het minimum geldt voor je gerechten — bezorgkosten tellen daar niet bij.",
  },
  {
    q: "Kan ik mijn bestelling afhalen?",
    a: "Ja. Kies afhalen, selecteer een beschikbaar moment en betaal online. Geen bezorgkosten.",
  },
  {
    q: "Kan ik ei of bacon toevoegen?",
    a: "Ja, bij smashburgers: gebakken ei (+ €1,00) en bacon (+ €0,75). Beide zijn optioneel en niet standaard inbegrepen.",
  },
  {
    q: "Kan ik augurk kiezen?",
    a: "Ja. Gratis augurk in plaats van komkommer en tomaat bij smashburgers.",
  },
  {
    q: "Welke sauzen zijn beschikbaar?",
    a: "Vraag naar de beschikbare sauzen of geef je keuze aan tijdens het bestellen. €0,50 per saus.",
  },
  {
    q: "Hoe werkt het bezorgtijdvak?",
    a: "Je kiest een venster van 30 minuten (bijv. 18.00–18.30). We streven ernaar binnen dat venster te bezorgen.",
  },
  {
    q: "Wat gebeurt er wanneer online bestellen gesloten is?",
    a: "Dan kun je geen bestelling plaatsen via de site. Gebruik WhatsApp of bel ons — we helpen je graag.",
  },
  {
    q: "Kan ik allergeneninformatie krijgen?",
    a: ALLERGEN_NOTICE,
  },
  {
    q: "Kan Grill Gasten worden geboekt voor een feest?",
    a: "Ja. Via Catering of WhatsApp kun je vrijblijvend vragen naar de mogelijkheden. Prijs op aanvraag.",
  },
] as const;

export function HomeFaqSection() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <h2 id="faq-heading" className="font-heading text-3xl uppercase tracking-wide text-white">
            Veelgestelde vragen
          </h2>
        </AnimatedContainer>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-white">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10">
          <FaqContactCta />
        </div>
      </div>
    </section>
  );
}
