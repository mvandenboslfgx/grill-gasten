import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { FeaturedFoodSection } from "@/components/featured-food-section";
import { FestivalExperienceSection } from "@/components/festival-experience-section";
import { WhySection } from "@/components/why-section";
import { SocialFeedSection } from "@/components/social-feed-section";
import { TestimonialSection } from "@/components/testimonial-section";
import { CTASection } from "@/components/cta-section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: site.metaDescriptionHome,
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedFoodSection />
      <FestivalExperienceSection />
      <WhySection />
      <TestimonialSection />
      <SocialFeedSection />
      <CTASection
        title="Klaar voor jouw line-up?"
        description="Hoogste conversie: offerte via catering, of direct een app voor snelle beschikbaarheid — Mike & Matthijs reageren het liefst via WhatsApp."
        primaryHref="/catering"
        primaryLabel="Catering — offerte"
        secondaryHref={site.whatsapp}
        secondaryLabel="WhatsApp"
        tertiaryHref="/contact"
        tertiaryLabel="Contact"
      />
    </>
  );
}
