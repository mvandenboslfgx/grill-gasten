import type { FoodAssetMeta } from "@/lib/data/food-imagery";
import { FOOD } from "@/lib/data/food-imagery";

export type GalleryTile = FoodAssetMeta & { alt: string };

export type GalleryCategory = {
  id: string;
  label: string;
  tagline: string;
  tiles: readonly GalleryTile[];
};

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  {
    id: "live-fire",
    label: "Live Fire",
    tagline: "Vuur op de plaat — sissende smash, gesmolten kaas, pure grillenergie.",
    tiles: [
      { ...FOOD.heroSmash, alt: "Dubbele smash op de grill — close-up van live fire" },
      { ...FOOD.loadedBacon, alt: "Loaded fries met bacon van de grill" },
    ],
  },
  {
    id: "signature-burgers",
    label: "Signature Burgers",
    tagline: "De smash die gasten terugbrengt naar de truck.",
    tiles: [
      { ...FOOD.smashHands, alt: "Signature smashburger in handen" },
      { ...FOOD.heroSmash, alt: "Premium double cheese smash" },
    ],
  },
  {
    id: "festival-vibes",
    label: "Festival Vibes",
    tagline: "Mainstage, late-night honger en rijen die doorlopen.",
    tiles: [
      { ...FOOD.smashHands, alt: "Festival streetfood — energie op het terrein" },
      { ...FOOD.loadedTray, alt: "Volgeladen tray voor de crowd" },
      { ...FOOD.drinkPeach, alt: "Huisgemaakte peach iced tea op het terrein" },
    ],
  },
  {
    id: "private-events",
    label: "Private Events",
    tagline: "Tuinfeesten, bruiloften en bedrijfsborrels — premium zonder saaie bedrijfstaal.",
    tiles: [
      { ...FOOD.loadedTray, alt: "Cateringtray voor een privé-event" },
      { ...FOOD.drinkLemonade, alt: "Verse lemonade voor gasten" },
      { ...FOOD.loadedBacon, alt: "Comfort food met luxe uitstraling" },
    ],
  },
] as const;
