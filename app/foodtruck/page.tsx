import type { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo-landing-template";
import { foodtruckLanding } from "@/lib/data/landings";

export const metadata: Metadata = {
  title: foodtruckLanding.metaTitle,
  description: foodtruckLanding.metaDescription,
};

export default function FoodtruckPage() {
  return <SeoLandingTemplate content={foodtruckLanding} />;
}
