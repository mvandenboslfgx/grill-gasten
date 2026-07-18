import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { SectionTitle } from "@/components/section-title";
import { catalogOptions } from "@/lib/catalog/options";
import {
  ALLERGEN_NOTICE,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  formatPriceCents,
  getProductsByCategory,
} from "@/lib/catalog/products";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Smashburgers vanaf €7,99, Double Smash €11,99, Triple €14,99, loaded fries en spicy chicken. Bestel bij Grill Gasten.",
};

function badgeLabel(badge: string | null): string | null {
  if (badge === "meest-gekozen") return "Meest gekozen";
  if (badge === "populair") return "Populair";
  if (badge === "pittig") return "Pittig";
  if (badge === "liefhebber") return "Voor de echte liefhebber";
  return null;
}

export default function MenuPage() {
  const extras = catalogOptions;

  return (
    <div className="border-t border-white/10 bg-[#080808] pb-16 pt-24 sm:pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-6xl space-y-14 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            eyebrow="Menu"
            title="Smashburgers & loaded fries"
            description="Actuele prijzen. Bestel online of via WhatsApp."
          />
          <div className="mt-6">
            <GlowButton href="/bestellen" variant="flame">
              Bestel nu
            </GlowButton>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl text-xs leading-relaxed">{ALLERGEN_NOTICE}</p>
        </AnimatedContainer>

        {CATEGORY_ORDER.filter((c) => c !== "extras").map((category) => {
          const items = getProductsByCategory(category);
          if (items.length === 0) return null;
          return (
            <section key={category} className="space-y-6">
              <h2 className="font-heading text-3xl uppercase tracking-wide text-white">
                {CATEGORY_LABELS[category]}
              </h2>
              <ul className="grid gap-6 md:grid-cols-2">
                {items.map((p) => {
                  const label = badgeLabel(p.badge);
                  return (
                    <li
                      key={p.id}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
                    >
                      <div className="grid sm:grid-cols-[140px_1fr]">
                        <div className="relative aspect-square sm:aspect-auto sm:min-h-[140px]">
                          <Image
                            src={p.imageSrc}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 140px"
                          />
                        </div>
                        <div className="space-y-2 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="font-heading text-xl uppercase text-white">{p.name}</h3>
                            <p className="font-semibold text-[#d4af37]">{formatPriceCents(p.priceCents)}</p>
                          </div>
                          {label ? (
                            <p className="text-primary text-[10px] font-bold uppercase tracking-wider">{label}</p>
                          ) : null}
                          <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
                          <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer text-white/80 hover:text-white">
                              Allergenen
                            </summary>
                            <p className="mt-2 leading-relaxed">
                              {p.allergens.length
                                ? p.allergens.join(", ")
                                : "Allergeneninformatie op aanvraag. " + ALLERGEN_NOTICE}
                            </p>
                          </details>
                          <Link
                            href="/bestellen"
                            className="inline-flex min-h-10 items-center text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                          >
                            Bestellen
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <section className="space-y-6">
          <h2 className="font-heading text-3xl uppercase tracking-wide text-white">Extra opties</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {extras.map((o) => (
              <li key={o.id} className="rounded-2xl border border-white/10 bg-[#111] p-5">
                <p className="font-heading text-lg uppercase text-white">{o.name}</p>
                <p className="mt-2 text-sm font-semibold text-[#d4af37]">
                  {o.priceCents === 0 ? "Gratis" : `+ ${formatPriceCents(o.priceCents)}`}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">{o.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex justify-center">
          <GlowButton href="/bestellen" variant="flame">
            Bestel nu
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
