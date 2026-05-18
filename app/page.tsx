import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { TrustBar } from "@/components/trust-bar";
import { BookEventsSection } from "@/components/book-events-section";
import { FeaturedFoodSection } from "@/components/featured-food-section";
import { FestivalExperienceSection } from "@/components/festival-experience-section";
import { WhySection } from "@/components/why-section";
import { PremiumGallerySection } from "@/components/premium-gallery-section";
import { PremiumBookingCta } from "@/components/premium-booking-cta";
import { TestimonialSection } from "@/components/testimonial-section";
import { HomeFaqSection } from "@/components/home-faq-section";
import { site } from "@/lib/site";
import { SEO_KEYWORDS } from "@/lib/seo/keywords";

export const metadata: Metadata = {
  title: "Premium BBQ foodtruck & catering",
  description: site.metaDescriptionHome,
  keywords: [...SEO_KEYWORDS],
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <BookEventsSection />
      <FeaturedFoodSection />
      <FestivalExperienceSection />
      <WhySection />
      <TestimonialSection />
      <PremiumGallerySection />
      <HomeFaqSection />
      <PremiumBookingCta />
    </>
  );
}
