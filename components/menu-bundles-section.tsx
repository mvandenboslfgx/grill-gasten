import { Check } from "lucide-react";
import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { SectionTitle } from "@/components/section-title";
import { menuBundles } from "@/lib/data/menu-bundles";

export function MenuBundlesSection() {
  return (
    <section className="space-y-8">
      <AnimatedContainer>
        <SectionTitle
          eyebrow="Bundels"
          title="Meest gekozen combinaties"
          description="Combo-deals met anchoring — ideaal voor events en groepsbestellingen."
        />
      </AnimatedContainer>
      <div className="grid gap-6 lg:grid-cols-3">
        {menuBundles.map((bundle, index) => (
          <AnimatedContainer key={bundle.id} delay={index * 0.06}>
            <article
              className={`relative flex h-full flex-col rounded-3xl border p-6 ${
                bundle.popular
                  ? "border-primary/50 bg-gradient-to-b from-primary/10 to-[#111] shadow-[0_0_50px_-20px_rgba(255,90,31,0.6)]"
                  : bundle.anchor
                    ? "border-[#d4af37]/40 bg-gradient-to-b from-[#d4af37]/8 to-[#111]"
                    : "border-white/10 bg-[#111]"
              }`}
            >
              {bundle.popular ? (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
                  Bestseller
                </span>
              ) : null}
              {bundle.savings ? (
                <p className="text-[#d4af37] text-xs font-semibold uppercase tracking-[0.18em]">{bundle.savings}</p>
              ) : null}
              <h3 className="font-heading mt-2 text-2xl uppercase tracking-wide text-white">{bundle.name}</h3>
              <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">{bundle.description}</p>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                {bundle.includes.map((line) => (
                  <li key={line} className="flex gap-2">
                    <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="font-heading mt-6 text-3xl text-primary">{bundle.price}</p>
              <GlowButton href="/bestellen" variant="outline" className="mt-4 w-full border-primary/40">
                Bestel bundel
              </GlowButton>
            </article>
          </AnimatedContainer>
        ))}
      </div>
    </section>
  );
}
