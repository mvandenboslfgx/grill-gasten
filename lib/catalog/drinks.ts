/**
 * Frisdrank — draft/catalogusstructuur.
 * Geen alcohol. Geen live prijzen tot de eigenaar bevestigt (ownerConfirmed + priceCents).
 */

import type { CatalogProduct, ProductAvailability } from "@/lib/catalog/types";
import { FOOD } from "@/lib/data/food-imagery";

export type DrinkDraft = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** null = maat nog niet bevestigd */
  sizeLabel: string | null;
  /** null = prijs nog niet bevestigd — nooit live verkopen */
  priceCents: number | null;
  ownerConfirmed: boolean;
  stockStatus: "available" | "sold_out";
  sortOrder: number;
};

/**
 * Voorbeeldassortiment — uitsluitend ter voorbereiding.
 * ownerConfirmed: false ⇒ niet in menu/checkout.
 */
export const DRINK_DRAFTS: readonly DrinkDraft[] = [
  {
    id: "drink-cola",
    slug: "coca-cola",
    name: "Coca-Cola",
    description: "Klassieke cola, gekoeld.",
    sizeLabel: null,
    priceCents: null,
    ownerConfirmed: false,
    stockStatus: "available",
    sortOrder: 10,
  },
  {
    id: "drink-cola-zero",
    slug: "coca-cola-zero",
    name: "Coca-Cola Zero",
    description: "Cola zonder suiker, gekoeld.",
    sizeLabel: null,
    priceCents: null,
    ownerConfirmed: false,
    stockStatus: "available",
    sortOrder: 20,
  },
  {
    id: "drink-fanta",
    slug: "fanta-orange",
    name: "Fanta Orange",
    description: "Sinaasappel frisdrank, gekoeld.",
    sizeLabel: null,
    priceCents: null,
    ownerConfirmed: false,
    stockStatus: "available",
    sortOrder: 30,
  },
  {
    id: "drink-sprite",
    slug: "sprite",
    name: "Sprite",
    description: "Citrus frisdrank, gekoeld.",
    sizeLabel: null,
    priceCents: null,
    ownerConfirmed: false,
    stockStatus: "available",
    sortOrder: 40,
  },
  {
    id: "drink-water-sparkling",
    slug: "water-bruisend",
    name: "Bruisend water",
    description: "Gekoeld bruisend water.",
    sizeLabel: null,
    priceCents: null,
    ownerConfirmed: false,
    stockStatus: "available",
    sortOrder: 50,
  },
  {
    id: "drink-water-still",
    slug: "water-plat",
    name: "Plat water",
    description: "Gekoeld plat water.",
    sizeLabel: null,
    priceCents: null,
    ownerConfirmed: false,
    stockStatus: "available",
    sortOrder: 60,
  },
] as const;

export function drinkDraftToCatalogProduct(draft: DrinkDraft): CatalogProduct | null {
  if (!draft.ownerConfirmed || draft.priceCents === null || !draft.sizeLabel) {
    return null;
  }
  const availability: ProductAvailability =
    draft.stockStatus === "sold_out" ? "sold_out" : "available";
  const sizeBit = draft.sizeLabel ? ` (${draft.sizeLabel})` : "";
  return {
    id: draft.id,
    slug: draft.slug,
    name: `${draft.name}${sizeBit}`,
    shortDescription: draft.description,
    longDescription: draft.description,
    description: draft.description,
    priceCents: draft.priceCents,
    category: "drinks",
    imageSrc: FOOD.drinkLemonade?.src ?? FOOD.heroSmash.src,
    availability,
    badge: null,
    spicyLevel: 0,
    allowedOptionIds: [],
    allergenStatus: "on_request",
    allergens: [],
    sortOrder: 500 + draft.sortOrder,
    featured: false,
    maxQuantityPerOrder: 20,
  };
}

/** Alleen bevestigde, geprijsde dranken — leeg tot eigenaar bevestigt. */
export function getConfirmedDrinkProducts(): CatalogProduct[] {
  return DRINK_DRAFTS.map(drinkDraftToCatalogProduct).filter(
    (p): p is CatalogProduct => p !== null,
  );
}

export function getActiveDrinkProducts(): CatalogProduct[] {
  return getConfirmedDrinkProducts().filter((p) => p.availability === "available");
}

export function countUnconfirmedDrinkDrafts(): number {
  return DRINK_DRAFTS.filter((d) => !d.ownerConfirmed).length;
}
