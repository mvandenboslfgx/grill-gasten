/**
 * Frisdrank — bevestigd launchassortiment (alcoholvrij).
 * Zichtbaar op menu; bestelbaar pas wanneer orderingEnabled true.
 */

import type { CatalogProduct, ProductAvailability } from "@/lib/catalog/types";
import { FOOD } from "@/lib/data/food-imagery";

export type DrinkDraft = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sizeLabel: string | null;
  priceCents: number | null;
  packaging: "blik" | "fles" | null;
  ownerConfirmed: boolean;
  stockStatus: "available" | "sold_out";
  sortOrder: number;
};

export const DRINK_DRAFTS: readonly DrinkDraft[] = [
  {
    id: "drink-cola",
    slug: "coca-cola-original",
    name: "Coca-Cola Original",
    description: "Klassieke cola, gekoeld.",
    sizeLabel: "330 ml",
    packaging: "blik",
    priceCents: 275,
    ownerConfirmed: true,
    stockStatus: "available",
    sortOrder: 10,
  },
  {
    id: "drink-cola-zero",
    slug: "coca-cola-zero",
    name: "Coca-Cola Zero",
    description: "Cola zonder suiker, gekoeld.",
    sizeLabel: "330 ml",
    packaging: "blik",
    priceCents: 275,
    ownerConfirmed: true,
    stockStatus: "available",
    sortOrder: 20,
  },
  {
    id: "drink-fanta",
    slug: "fanta-orange",
    name: "Fanta Orange",
    description: "Sinaasappel frisdrank, gekoeld.",
    sizeLabel: "330 ml",
    packaging: "blik",
    priceCents: 275,
    ownerConfirmed: true,
    stockStatus: "available",
    sortOrder: 30,
  },
  {
    id: "drink-sprite",
    slug: "sprite",
    name: "Sprite",
    description: "Citrus frisdrank, gekoeld.",
    sizeLabel: "330 ml",
    packaging: "blik",
    priceCents: 275,
    ownerConfirmed: true,
    stockStatus: "available",
    sortOrder: 40,
  },
  {
    id: "drink-water-still",
    slug: "water-plat",
    name: "Plat water",
    description: "Gekoeld plat water.",
    sizeLabel: "500 ml",
    packaging: "fles",
    priceCents: 250,
    ownerConfirmed: true,
    stockStatus: "available",
    sortOrder: 50,
  },
  {
    id: "drink-water-sparkling",
    slug: "water-bruisend",
    name: "Bruisend water",
    description: "Gekoeld bruisend water.",
    sizeLabel: "500 ml",
    packaging: "fles",
    priceCents: 250,
    ownerConfirmed: true,
    stockStatus: "available",
    sortOrder: 60,
  },
] as const;

/** Generieke drankvisual — geen merkspecifieke branding. */
const DRINK_IMAGE = FOOD.drinkLemonade.src;

export function drinkDraftToCatalogProduct(draft: DrinkDraft): CatalogProduct | null {
  if (!draft.ownerConfirmed || draft.priceCents === null || !draft.sizeLabel) {
    return null;
  }
  const availability: ProductAvailability =
    draft.stockStatus === "sold_out" ? "sold_out" : "available";
  const pack = draft.packaging ? ` ${draft.packaging}` : "";
  const sizeBit = ` (${draft.sizeLabel}${pack})`;
  return {
    id: draft.id,
    slug: draft.slug,
    name: `${draft.name}${sizeBit}`,
    shortDescription: draft.description,
    longDescription: draft.description,
    description: draft.description,
    priceCents: draft.priceCents,
    category: "drinks",
    imageSrc: DRINK_IMAGE,
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
