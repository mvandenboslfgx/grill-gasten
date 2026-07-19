/** Catalog types — shared frontend/backend. */

export type ProductCategory =
  | "smashburgers"
  | "chicken"
  | "loaded-fries"
  | "fries"
  | "sauces"
  | "drinks"
  | "extras";

export type ProductAvailability = "available" | "sold_out" | "hidden";

export type ProductBadge =
  | "meest-gekozen"
  | "populair"
  | "pittig"
  | "liefhebber"
  | null;

export type AllergenStatus = "listed" | "on_request";

export type OptionKind = "addon" | "swap";

export type CatalogOption = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  kind: OptionKind;
  unique: boolean;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  /** @deprecated alias for shortDescription in older UI */
  description: string;
  priceCents: number;
  category: ProductCategory;
  imageSrc: string;
  availability: ProductAvailability;
  badge: ProductBadge;
  spicyLevel: 0 | 1 | 2 | 3;
  allowedOptionIds: readonly string[];
  allergenStatus: AllergenStatus;
  allergens: readonly string[];
  sortOrder: number;
  featured: boolean;
  maxQuantityPerOrder: number;
  /** Product is a sauce line that accepts a free-text choice (max 30 chars) */
  requiresSauceChoice?: boolean;
};

export type ClientOrderLineInput = {
  productId: string;
  qty: number;
  optionIds: string[];
  sauceChoice?: string;
  note?: string;
};

export type PricedOrderLine = {
  productId: string;
  name: string;
  qty: number;
  optionIds: string[];
  optionLabels: string[];
  sauceChoice?: string;
  unitPriceCents: number;
  lineTotalCents: number;
  note?: string;
};

export type FulfillmentMethod = "pickup" | "delivery";
