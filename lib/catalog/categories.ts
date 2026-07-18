import type { ProductCategory } from "@/lib/catalog/types";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  smashburgers: "Smashburgers",
  chicken: "Chicken",
  "loaded-fries": "Loaded fries",
  fries: "Friet",
  sauces: "Sauzen",
  extras: "Extra opties",
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "smashburgers",
  "chicken",
  "loaded-fries",
  "fries",
  "sauces",
  "extras",
];
