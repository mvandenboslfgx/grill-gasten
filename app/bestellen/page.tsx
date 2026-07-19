import type { Metadata } from "next";
import { ClosedOrderingExperience } from "@/features/order/closed-ordering-experience";
import { OrderFlow } from "@/features/order/order-flow";
import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import { ALLERGEN_NOTICE } from "@/lib/catalog/products";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import { CLOSED_ORDERING_COPY } from "@/features/order/closed-ordering-content";
import { site } from "@/lib/site";

export const metadata: Metadata = orderingConfig.orderingEnabled
  ? {
      title: "Bestellen",
      description:
        "Bestel smashburgers, loaded fries en spicy chicken bij Grill Gasten. Kies afhaalmoment en betaal veilig online.",
    }
  : {
      title: CLOSED_ORDERING_COPY.metaTitle,
      description: CLOSED_ORDERING_COPY.metaDescription,
      openGraph: {
        title: CLOSED_ORDERING_COPY.metaTitle,
        description: CLOSED_ORDERING_COPY.metaDescription,
        url: `${site.url}/bestellen`,
      },
    };

export default function BestellenPage() {
  if (!orderingConfig.orderingEnabled) {
    return (
      <div className="site-page">
        <ClosedOrderingExperience />
      </div>
    );
  }

  return (
    <div className="site-page">
      <div className="mx-auto max-w-6xl space-y-8 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            eyebrow="Afhalen"
            title="Bestellen"
            description="Kies je gerechten, kies een afhaalmoment en betaal veilig. Je bestelling wordt vers bereid."
          />
          <p className="text-muted-foreground mt-4 max-w-2xl text-xs leading-relaxed">
            {ALLERGEN_NOTICE}
          </p>
        </AnimatedContainer>
        <OrderFlow />
      </div>
    </div>
  );
}
