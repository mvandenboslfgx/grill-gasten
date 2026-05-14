import type { Metadata } from "next";
import Link from "next/link";
import { Flame, MapPin, MessageCircle, Music2, Share2 } from "lucide-react";
import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import { ContactForm } from "@/features/forms/contact-form";
import { GlowButton } from "@/components/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Grill Gasten — festivals, catering en streetfood door heel Nederland. Regio Hoeksche Waard. Bereikbaar via WhatsApp.",
};

export default function ContactPage() {
  return (
    <div className="border-t border-white/10 bg-[#080808] pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 md:grid-cols-2 md:px-6 lg:px-8">
        <AnimatedContainer className="space-y-8">
          <SectionTitle
            eyebrow="Contact"
            title="Vragen, boekingen of samenwerken?"
            description="Grill Gasten is beschikbaar voor festivals, catering, events en streetfood locaties door heel Nederland."
          />

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="text-white">Regio Hoeksche Waard</span> — inzetbaar door heel Nederland
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="text-white">Primair bereikbaar via WhatsApp</span> — snelste reactie voor boekingen en
                vragen.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Flame className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>Festivals, catering, events en streetfood locaties</span>
            </li>
          </ul>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-[#111] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">Direct</p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <MessageCircle className="size-4 shrink-0 text-primary" aria-hidden />
                <a className="hover:text-white" href={site.whatsapp} rel="noreferrer" target="_blank">
                  WhatsApp — boekingen & vragen
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Share2 className="size-4 shrink-0 text-primary" aria-hidden />
                <Link className="hover:text-white" href={site.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Music2 className="size-4 shrink-0 text-primary" aria-hidden />
                <Link className="hover:text-white" href={site.tiktok} target="_blank" rel="noreferrer">
                  TikTok
                </Link>
              </li>
            </ul>
          </div>

          <GlowButton href={site.whatsapp} variant="flame">
            Open WhatsApp
          </GlowButton>
        </AnimatedContainer>

        <AnimatedContainer delay={0.08}>
          <div className="rounded-3xl border border-white/10 bg-[#111] p-6 md:p-8">
            <h2 className="font-heading text-2xl tracking-wide text-white uppercase">Stuur een bericht</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Liever schriftelijk? Vul het formulier in — we koppelen terug (demo: nog geen e-mailbackend).
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
