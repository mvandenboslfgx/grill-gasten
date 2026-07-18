import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

export function HomeCateringCta() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] py-14 md:py-20" aria-labelledby="catering-cta">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer className="rounded-3xl border border-white/10 bg-[#111] p-6 md:p-10">
          <h2 id="catering-cta" className="font-heading text-2xl uppercase tracking-wide text-white md:text-3xl">
            Grill Gasten boeken voor een feest of evenement?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
            Voor verjaardagen, bedrijfsfeesten of buurtfeesten denken we graag mee. Vraag vrijblijvend naar de
            mogelijkheden — prijs op aanvraag.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <GlowButton href="/catering" variant="outline">
              Catering
            </GlowButton>
            <GlowButton href={getWhatsAppHref("catering")} variant="flame">
              WhatsApp {site.founders.split(" ")[0]}
            </GlowButton>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
