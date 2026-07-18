import Link from "next/link";
import { AnimatedContainer } from "@/components/animated-container";
import { formatPriceCents, getProductById } from "@/lib/catalog/products";

const SIZES = [
  { id: "single-smash", highlight: false },
  { id: "double-smash", highlight: true },
  { id: "triple-smash", highlight: false },
] as const;

export function BurgerSizesSection() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] py-16 md:py-24" aria-labelledby="sizes-heading">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.28em]">Smashburgers</p>
          <h2 id="sizes-heading" className="font-heading mt-3 text-3xl uppercase tracking-wide text-white md:text-4xl">
            Single, Double of Triple
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
            Dezelfde Grill Gasten-opbouw — kies hoeveel patties jij aankan. Double is onze meest gekozen.
          </p>
        </AnimatedContainer>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {SIZES.map(({ id, highlight }, i) => {
            const p = getProductById(id)!;
            return (
              <AnimatedContainer key={id} delay={i * 0.06}>
                <li className="list-none">
                <article
                  className={`flex h-full flex-col rounded-2xl border p-6 ${
                    highlight
                      ? "border-primary/50 bg-primary/[0.08] shadow-[0_0_40px_-12px_rgba(255,90,31,0.5)]"
                      : "border-white/10 bg-[#111]"
                  }`}
                >
                  {highlight ? (
                    <p className="text-primary mb-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Aanbevolen
                    </p>
                  ) : null}
                  <h3 className="font-heading text-xl uppercase text-white">{p.name}</h3>
                  <p className="mt-4 text-3xl font-semibold text-[#d4af37]">
                    {formatPriceCents(p.priceCents)}
                  </p>
                  <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">{p.description}</p>
                  <Link
                    href="/bestellen"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-primary text-xs font-bold uppercase tracking-wider text-primary-foreground"
                  >
                    Bestel nu
                  </Link>
                </article>
                </li>
              </AnimatedContainer>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
