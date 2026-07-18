/** Product- en besteltypes — shared frontend/backend. */

export type ProductCategory =
  | "smashburgers"
  | "chicken"
  | "loaded-fries"
  | "fries-sauces"
  | "extras";

export type ProductAvailability = "available" | "sold_out" | "hidden";

export type ProductBadge =
  | "meest-gekozen"
  | "populair"
  | "pittig"
  | "liefhebber"
  | null;

export type OptionKind = "addon" | "swap";

export type CatalogOption = {
  id: string;
  name: string;
  description: string;
  /** Prijs in centen; 0 = gratis (bijv. swap) */
  priceCents: number;
  kind: OptionKind;
  /** Max 1× per orderregel */
  unique: boolean;
};

export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: ProductCategory;
  imageSrc: string;
  availability: ProductAvailability;
  badge: ProductBadge;
  spicyLevel: 0 | 1 | 2 | 3;
  /** Option-ID's die bij dit product mogen */
  allowedOptionIds: readonly string[];
  /**
   * Allergenen. Leeg = nog niet vastgelegd → toon "op aanvraag".
   */
  allergens: readonly string[];
  sortOrder: number;
  /** Op homepage "populair" tonen */
  featured: boolean;
};

export type ClientOrderLineInput = {
  productId: string;
  qty: number;
  optionIds: string[];
  note?: string;
};

export type PricedOrderLine = {
  productId: string;
  name: string;
  qty: number;
  optionIds: string[];
  optionLabels: string[];
  unitPriceCents: number;
  lineTotalCents: number;
  note?: string;
};
