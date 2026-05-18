import type { Metadata } from "next";
import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import { PreorderFlow } from "@/features/preorder/preorder-flow";

export const metadata: Metadata = {
  title: "Eten reserveren",
  description:
    "Reserveer smashburgers en loaded fries vooraf bij Grill Gasten. Kies tijdslot, ontvang QR voor afhalen bij de foodtruck.",
};

export default function BestellenPage() {
  return (
    <div className="border-t border-white/10 bg-[#080808] pb-16 pt-24 sm:pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-6xl space-y-10 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            eyebrow="Pre-order"
            title="Eten reserveren"
            description="Kortere wachtrij, meer gemak. Bestel vooraf en haal af bij de truck met je QR-code."
          />
        </AnimatedContainer>
        <PreorderFlow />
      </div>
    </div>
  );
}
