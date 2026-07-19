import { CTASection } from "@/components/cta-section";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { site } from "@/lib/site";

export function MenuContactCta() {
  return (
    <CTASection
      title="Catering voor jouw gelegenheid?"
      description="Vraag vrijblijvend wat mogelijk is — WhatsApp, bellen of het cateringformulier."
      primaryHref="/catering#booking"
      primaryLabel="Boek direct"
      secondaryHref={getWhatsAppHref("menu")}
      secondaryLabel="WhatsApp"
      tertiaryHref={site.phoneTel}
      tertiaryLabel={`Bel ${site.phoneDisplay}`}
    />
  );
}
