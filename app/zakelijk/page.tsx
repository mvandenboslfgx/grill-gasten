import type { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo-landing-template";
import { zakelijkLanding } from "@/lib/data/landings";

export const metadata: Metadata = {
  title: zakelijkLanding.metaTitle,
  description: zakelijkLanding.metaDescription,
};

export default function ZakelijkPage() {
  return <SeoLandingTemplate content={zakelijkLanding} />;
}
