import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqContactCta } from "@/components/faq-contact-cta";
import { homeFaqs } from "@/lib/data/home";

export function HomeFaqSection() {
  return (
    <section className="border-t border-white/10 bg-[#050505] py-20 md:py-28" id="faq">
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            align="center"
            eyebrow="Veelgesteld"
            title="Alles wat je wilt weten vóór je boekt"
            description="Geen verrassingen achteraf — helder over regio, kosten en hoe snel je antwoord krijgt."
          />
        </AnimatedContainer>
        <AnimatedContainer delay={0.08} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {homeFaqs.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`} className="border-white/10">
                <AccordionTrigger className="text-left text-base font-medium text-white hover:text-primary">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedContainer>
        <FaqContactCta />
      </div>
    </section>
  );
}
