/**
 * Alleen eten & drank — Pexels photo-ID’s die 200 geven en passen bij smash / streetfood / drinks.
 * Zie `next.config.ts` remotePatterns voor `images.pexels.com`.
 *
 * Vervang stapsgewijs door lokale WebP/AVIF onder `public/images/food/` (zie `public/ASSET-PIPELINE.txt`).
 */
export function foodImage(id: number, width: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&fit=crop`;
}

/** Hero smashburger (macro) */
export const IMG_HERO_BURGER = foodImage(1639562, 1400);

/** Story / side visual — burger close-up */
export const IMG_BURGER_PLATE = foodImage(1640777, 1400);

/** Catering / festival sfeer — streetfood truck (eten in beeld) */
export const IMG_FOOD_TRUCK = foodImage(4393021, 2000);

/** Achtergrond festival-sectie — food scene (geen menigte- of concert-stock) */
export const IMG_FESTIVAL_FOOD = foodImage(3026808, 2000);

/** Social grid — smash, loaded, vlees, saus, grill, drank (geen “healthy” of random stock) */
export const SOCIAL_FOOD_TILE_IDS = [
  1639562,
  3616760,
  2342121,
  5771896,
  1640777,
  2874989,
  3026808,
  1251198,
  1586942,
] as const;

export function socialFoodTileUrl(id: (typeof SOCIAL_FOOD_TILE_IDS)[number]) {
  return foodImage(id, 800);
}
