import { CTASection } from "@/components/cta-section";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { site } from "@/lib/site";

export function MenuContactCta() {
  return (
    <CTASection
      title="Foodtruck op jouw event?"
      description="Vraag beschikbaarheid — WhatsApp, bellen of offerte via catering."
      primaryHref="/catering#booking"
      primaryLabel="Boek direct"
      secondaryHref={getWhatsAppHref("menu")}
      secondaryLabel="WhatsApp"
      tertiaryHref={site.phoneTel}
      tertiaryLabel={`Bel ${site.phoneDisplay}`}
    />
  );
}
