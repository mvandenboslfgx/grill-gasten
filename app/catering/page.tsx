import type { Metadata } from "next";
import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { SectionTitle } from "@/components/section-title";
import { CateringBookingForm } from "@/features/forms/catering-booking-form";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Catering",
  description: `Burger catering en foodtruck boeken bij ${site.name} — feestjes, verjaardagen en bedrijfsmomenten. Prijs op aanvraag.`,
};

const OCCASIONS = [
  "Verjaardag of privéfeest",
  "Bedrijfsmoment of borrel",
  "Buurtfeest of kleinschalig evenement",
  "Andere aanvraag in overleg",
] as const;

export default function CateringPage() {
  return (
    <div className="site-page">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 md:grid-cols-2 md:px-6 lg:px-8">
        <AnimatedContainer className="space-y-8">
          <SectionTitle
            eyebrow="Catering"
            title="Boek Grill Gasten voor je feest"
            description="Smashburgers en loaded fries op locatie — prijs op aanvraag, op basis van aantal gasten, locatie en menu."
          />
          <ul className="space-y-3 text-sm text-muted-foreground">
            {OCCASIONS.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="text-primary" aria-hidden>
                  ·
                </span>
                {o}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Geen vaste pakketprijzen op de site: we maken een offerte die past bij jouw gelegenheid.
            Snelste route: WhatsApp naar {site.founders}.
          </p>
          <GlowButton href={getWhatsAppHref("catering")} variant="flame">
            WhatsApp
          </GlowButton>
        </AnimatedContainer>

        <div id="booking">
          <AnimatedContainer delay={0.06}>
          <div className="rounded-3xl border border-white/10 bg-[#111] p-6 md:p-8">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-white">
              Vrijblijvende aanvraag
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              We reageren zo snel mogelijk via e-mail of telefoon.
            </p>
            <div className="mt-6">
              <CateringBookingForm />
            </div>
          </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
}
