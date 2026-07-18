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
    a: "Ga naar Bestellen, kies je gerechten en extras, kies een beschikbaar afhaalmoment en betaal veilig online. Daarna haal je je bestelling af op het gekozen tijdstip.",
  },
  {
    q: "Kan ik ei of bacon toevoegen?",
    a: "Ja. Gebakken ei (+ €1,00) en bacon (+ €0,75) zijn optionele extras bij burgers. Ze zijn niet standaard inbegrepen.",
  },
  {
    q: "Kan ik augurk kiezen?",
    a: "Ja. Je kunt gratis augurk kiezen als vervanging voor komkommer en tomaat in de standaard burgeropbouw.",
  },
  {
    q: "Welke sauzen zijn beschikbaar?",
    a: "Sauzen wisselen mee met wat we die dag hebben. Vraag ernaar bij bestellen of via WhatsApp — losse saus kost €0,50.",
  },
  {
    q: "Hoe werkt afhalen?",
    a: "Na betaling krijg je een bestelnummer en afhaalmoment. Kom op tijd — te laat afhalen kan betekenen dat de bestelling kouder is of niet meer klaarstaat.",
  },
  {
    q: "Kan ik allergeneninformatie krijgen?",
    a: ALLERGEN_NOTICE,
  },
  {
    q: "Kan Grill Gasten ook worden geboekt voor een feest?",
    a: "Ja. Voor feestjes, verjaardagen of bedrijfsmomenten kun je via Catering of WhatsApp een vrijblijvende aanvraag doen. Prijs op aanvraag.",
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
