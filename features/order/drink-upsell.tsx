"use client";

import { formatPriceCents } from "@/lib/catalog/format-money";
import type { CatalogProduct } from "@/lib/catalog/types";
import { GlowButton } from "@/components/button";

type Props = {
  drinks: CatalogProduct[];
  onAdd: (productId: string) => void;
  onDismiss: () => void;
  variant: "after-burger" | "cart";
};

/**
 * Soft drink upsell — never auto-adds, always shows price, dismissible.
 */
export function DrinkUpsell({ drinks, onAdd, onDismiss, variant }: Props) {
  if (drinks.length === 0) return null;

  const title =
    variant === "after-burger"
      ? "Wil je daar een drankje bij?"
      : "Maak je bestelling compleet met een koud drankje.";

  return (
    <aside
      className="rounded-2xl border border-white/10 bg-[#141414] p-4"
      aria-label="Suggestie: frisdrank"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-white">{title}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="min-h-11 min-w-11 shrink-0 rounded-lg text-xs uppercase tracking-wider text-muted-foreground hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Suggestie sluiten"
        >
          Sluiten
        </button>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {drinks.slice(0, 4).map((d) => (
          <li key={d.id}>
            <GlowButton
              type="button"
              variant="outline"
              className="flex w-full min-h-11 items-center justify-between gap-2 px-3 text-left text-sm normal-case tracking-normal"
              onClick={() => onAdd(d.id)}
            >
              <span className="truncate">{d.name}</span>
              <span className="shrink-0 text-primary">{formatPriceCents(d.priceCents)}</span>
            </GlowButton>
          </li>
        ))}
      </ul>
    </aside>
  );
}
