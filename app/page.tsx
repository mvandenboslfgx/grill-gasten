import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { PopularDishesSection } from "@/components/popular-dishes-section";
import { BurgerSizesSection } from "@/components/burger-sizes-section";
import { ExtraOptionsSection } from "@/components/extra-options-section";
import { PickupDeliverySection } from "@/components/pickup-delivery-section";
import { HowToOrderSection } from "@/components/how-to-order-section";
import { HomeAboutSnippet } from "@/components/home-about-snippet";
import { HomeCateringCta } from "@/components/home-catering-cta";
import { HomeFaqSection } from "@/components/home-faq-section";
import { SocialProofSection } from "@/components/social-proof-section";
import { site } from "@/lib/site";
import { SEO_KEYWORDS } from "@/lib/seo/keywords";

export const metadata: Metadata = {
  title: "Smashburgers bestellen",
  description: site.metaDescriptionHome,
  keywords: [...SEO_KEYWORDS],
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularDishesSection />
      <BurgerSizesSection />
      <ExtraOptionsSection />
      <PickupDeliverySection />
      <HowToOrderSection />
      <HomeAboutSnippet />
      <SocialProofSection />
      <HomeCateringCta />
      <HomeFaqSection />
    </>
  );
}
