import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";

export function PickupDeliverySection() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] py-14 md:py-20" aria-labelledby="fulfill-heading">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <h2 id="fulfill-heading" className="font-heading text-2xl uppercase tracking-wide text-white md:text-3xl">
            Afhalen of bezorgen
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            Kies wat jou past — in de hele Hoeksche Waard.
          </p>
        </AnimatedContainer>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <AnimatedContainer>
            <article className="h-full rounded-2xl border border-white/10 bg-[#111] p-6">
              <h3 className="font-heading text-xl uppercase text-white">Afhalen</h3>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                <li>· Geen bezorgkosten</li>
                <li>· Kies een beschikbaar afhaalmoment</li>
                <li>· Duidelijke bestelbevestiging na betaling</li>
              </ul>
            </article>
          </AnimatedContainer>
          <AnimatedContainer delay={0.05}>
            <article className="h-full rounded-2xl border border-primary/35 bg-primary/[0.06] p-6">
              <h3 className="font-heading text-xl uppercase text-white">Bezorgen</h3>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                <li>· In de hele Hoeksche Waard</li>
                <li>· Bezorgkosten op basis van afstand</li>
                <li>· Minimum bestelling afhankelijk van zone</li>
                <li>· Tijdvak van 30 minuten</li>
                <li>· Tot maximaal 25 km vanaf Klaaswaal</li>
              </ul>
            </article>
          </AnimatedContainer>
        </div>
        <div className="mt-8">
          <GlowButton href="/bestellen" variant="flame">
            Bestellen
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
