import type { Metadata } from "next";
import { OrderFlow } from "@/features/order/order-flow";
import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import { ALLERGEN_NOTICE } from "@/lib/catalog/products";

export const metadata: Metadata = {
  title: "Bestellen",
  description:
    "Bestel smashburgers, loaded fries en spicy chicken bij Grill Gasten. Kies afhaalmoment en betaal veilig online.",
};

export default function BestellenPage() {
  return (
    <div className="site-page">
      <div className="mx-auto max-w-6xl space-y-8 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            eyebrow="Afhalen"
            title="Bestel nu"
            description="Kies je gerechten, kies een afhaalmoment en betaal veilig. Je bestelling wordt vers bereid."
          />
          <p className="text-muted-foreground mt-4 max-w-2xl text-xs leading-relaxed">{ALLERGEN_NOTICE}</p>
        </AnimatedContainer>
        <OrderFlow />
      </div>
    </div>
  );
}
