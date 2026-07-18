import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

export function SocialProofSection() {
  return (
    <section className="border-t border-white/10 bg-[#080808] py-14 md:py-16" aria-labelledby="social-proof">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer className="rounded-3xl border border-[#d4af37]/25 bg-gradient-to-b from-[#151515] to-[#0c0c0c] p-6 md:p-8">
          <h2 id="social-proof" className="font-heading text-2xl uppercase tracking-wide text-white">
            Grill Gasten zelf geproefd?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
            Deel je ervaring via Instagram, TikTok of WhatsApp. We lezen alles mee.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <GlowButton href={site.instagram} variant="outline">
              Instagram
            </GlowButton>
            <GlowButton href={site.tiktok} variant="outline">
              TikTok
            </GlowButton>
            <GlowButton href={getWhatsAppHref("home")} variant="flame">
              WhatsApp
            </GlowButton>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
