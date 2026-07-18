import Image from "next/image";
import { Check } from "lucide-react";
import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { CTASection } from "@/components/cta-section";
import { TrustStrip } from "@/components/trust-strip";
import { PhoneLink } from "@/components/phone-link";
import type { LandingContent } from "@/lib/data/landings";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

type SeoLandingTemplateProps = {
  content: LandingContent;
};

export function SeoLandingTemplate({ content }: SeoLandingTemplateProps) {
  return (
    <>
      <section className="site-page-hero-pad relative isolate overflow-hidden border-t border-white/10">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt={content.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/88 to-black/50" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_20%,rgba(255,90,31,0.18),transparent_55%)]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28 lg:px-8">
          <div className="max-w-xl space-y-6">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.42em]">
              {content.eyebrow} · {site.founders}
            </p>
            <h1 className="font-heading text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] tracking-[0.03em] text-white uppercase">
              {content.title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed md:text-lg">{content.subtitle}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <GlowButton href="/catering#booking" variant="flame">
                Boek direct
              </GlowButton>
              <GlowButton href={getWhatsAppHref(content.whatsappIntent)} variant="outline">
                WhatsApp
              </GlowButton>
              <PhoneLink className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-primary">
                {site.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080808] py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:px-6 lg:px-8">
          <AnimatedContainer className="space-y-6">
            {content.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-muted-foreground text-sm leading-relaxed md:text-base">
                {paragraph}
              </p>
            ))}
            <ul className="space-y-3">
              {content.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                  <Check className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedContainer>
          <AnimatedContainer delay={0.08}>
            <TrustStrip />
          </AnimatedContainer>
        </div>
      </section>

      <CTASection
        title={content.ctaTitle}
        description="Offerte via catering of direct WhatsApp — Mike en Matthijs reageren snel."
        primaryHref="/catering#booking"
        primaryLabel="Boek direct"
        secondaryHref={getWhatsAppHref(content.whatsappIntent)}
        secondaryLabel="WhatsApp"
      />
    </>
  );
}
