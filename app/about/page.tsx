import type { Metadata } from "next";
import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { SectionTitle } from "@/components/section-title";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Over ons",
  description: `Over ${site.name} — ${site.founders}. Smashburgers en loaded fries uit de ${site.region}.`,
};

export default function AboutPage() {
  return (
    <div className="site-page">
      <div className="mx-auto max-w-3xl space-y-10 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            eyebrow="Over ons"
            title={`${site.founders}`}
            description={`Grill Gasten uit de ${site.region}.`}
          />
        </AnimatedContainer>
        <AnimatedContainer className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            Grill Gasten is begonnen vanuit een gedeelde liefde voor goed eten, stevige burgers en
            gezelligheid. We willen gerechten maken waar we zelf enthousiast van worden: verse
            smashburgers, loaded fries en combinaties zonder onnodig gedoe.
          </p>
          <p>
            Of je nu online bestelt om af te halen, of ons vraagt voor een feestje — we houden het
            persoonlijk, eerlijk en lekker.
          </p>
        </AnimatedContainer>
        <div className="flex flex-wrap gap-3">
          <GlowButton href="/bestellen" variant="flame">
            Bestellen
          </GlowButton>
          <GlowButton href={getWhatsAppHref("home")} variant="outline">
            WhatsApp
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
