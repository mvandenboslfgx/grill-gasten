import Image from "next/image";
import Link from "next/link";
import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { SectionTitle } from "@/components/section-title";
import {
  formatPriceCents,
  getFeaturedProducts,
} from "@/lib/catalog/products";

function badgeLabel(badge: string | null): string | null {
  if (badge === "meest-gekozen") return "Meest gekozen";
  if (badge === "populair") return "Populair";
  if (badge === "pittig") return "Pittig";
  if (badge === "liefhebber") return "Liefhebber";
  return null;
}

export function PopularDishesSection() {
  const items = getFeaturedProducts().slice(0, 4);

  return (
    <section className="border-t border-white/10 bg-[#080808] py-16 md:py-24" aria-labelledby="popular-heading">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            id="popular-heading"
            eyebrow="Menu"
            title="Populaire gerechten"
            description="Onze smashburgers en loaded fries — echte prijzen, klaar om te bestellen."
          />
        </AnimatedContainer>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => {
            const label = badgeLabel(p.badge);
            return (
              <AnimatedContainer key={p.id} as="li" delay={i * 0.05} className="list-none">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={p.imageSrc}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                    {label ? (
                      <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                        {label}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="font-heading text-lg uppercase text-white">
                      {p.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">{p.description}</p>
                    <p className="text-sm font-semibold text-[#d4af37]">{formatPriceCents(p.priceCents)}</p>
                    <Link
                      href="/bestellen"
                      className="mt-1 inline-flex min-h-11 items-center justify-center rounded-full bg-primary text-xs font-bold uppercase tracking-wider text-primary-foreground"
                    >
                      Bestellen
                    </Link>
                  </div>
                </article>
              </AnimatedContainer>
            );
          })}
        </ul>
        <div className="mt-10 flex justify-center">
          <GlowButton href="/menu" variant="outline">
            Volledig menu
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
