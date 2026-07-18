/**
 * @deprecated Gebruik `@/lib/catalog/products`.
 */
export {
  catalogProducts as menuItems,
  formatPriceCents,
  getProductById,
  getVisibleProducts,
  getFeaturedProducts,
} from "@/lib/catalog/products";

export type { CatalogProduct as MenuItem } from "@/lib/catalog/types";

/** Compat: oude featured highlights → featured catalog products */
export { getFeaturedProducts as featuredHighlights } from "@/lib/catalog/products";
