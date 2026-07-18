import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { getWhatsAppHref } from "@/lib/whatsapp";

export function HomeCateringCta() {
  return (
    <section
      className="border-t border-white/10 bg-[#0a0a0a] py-14 md:py-20"
      aria-labelledby="catering-cta"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer className="mx-auto w-full min-w-0 max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#111] p-5 sm:p-6 md:p-8 lg:p-10">
          <h2
            id="catering-cta"
            className="font-heading max-w-2xl text-2xl uppercase tracking-[0.04em] text-white md:text-3xl"
          >
            Grill Gasten voor jouw feest of gelegenheid?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed md:text-[0.95rem] md:leading-7">
            Van verjaardagen en buurtfeesten tot bedrijfsmomenten: we denken graag
            mee over het menu en de mogelijkheden. Vraag vrijblijvend een
            cateringvoorstel aan.
          </p>
          <div className="mt-6 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
            <GlowButton
              href="/catering"
              variant="flame"
              className="min-h-12 w-full sm:w-auto"
            >
              Catering aanvragen
            </GlowButton>
            <GlowButton
              href={getWhatsAppHref("catering")}
              variant="outline"
              className="min-h-12 w-full sm:w-auto"
            >
              WhatsApp
            </GlowButton>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
