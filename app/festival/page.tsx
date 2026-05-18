import type { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo-landing-template";
import { festivalLanding } from "@/lib/data/landings";

export const metadata: Metadata = {
  title: festivalLanding.metaTitle,
  description: festivalLanding.metaDescription,
};

export default function FestivalPage() {
  return <SeoLandingTemplate content={festivalLanding} />;
}
