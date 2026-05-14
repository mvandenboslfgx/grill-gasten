import { foodImage } from "@/lib/data/food-imagery";

export type MenuCategory = "Smash Burgers" | "Loaded Fries" | "Snacks" | "Drinks";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  popular?: boolean;
  spicy?: 1 | 2 | 3;
};

/** Prijzen zijn indicatief — pas aan zodra definitief vastligt. */
export const menuItems: MenuItem[] = [
  {
    id: "classic-smash",
    name: "Classic Smash",
    description: "Dubbele smash, American cheese, augurk, ui, GG saus — de basis die alles deelt.",
    price: "€11,50",
    category: "Smash Burgers",
    popular: true,
  },
  {
    id: "double-trouble",
    name: "Double Trouble",
    description: "Twee patties, dubbele cheese, bacon, BBQ glaze — voor als één laag niet genoeg is.",
    price: "€14,00",
    category: "Smash Burgers",
    popular: true,
  },
  {
    id: "bbq-beast",
    name: "BBQ Beast",
    description: "Smash, pulled-style topping, crispy onions, smoky BBQ — straight from de pit.",
    price: "€13,50",
    category: "Smash Burgers",
  },
  {
    id: "hot-flame",
    name: "Hot Flame",
    description: "Jalapeño, pepper jack, hot honey — heat waar je om vroeg.",
    price: "€13,00",
    category: "Smash Burgers",
    spicy: 3,
    popular: true,
  },
  {
    id: "cheesy-madness",
    name: "Cheesy Madness",
    description: "Extra cheese pull, caramelized onions, secret drizzle — geen excuses.",
    price: "€12,50",
    category: "Smash Burgers",
  },
  {
    id: "pulled-chicken-loaded",
    name: "Pulled Chicken Loaded Fries",
    description: "Golden fries, pulled chicken, sauce, spring onion — volgeladen.",
    price: "€10,50",
    category: "Loaded Fries",
    popular: true,
  },
  {
    id: "bbq-bacon-fries",
    name: "BBQ Bacon Fries",
    description: "Smoky BBQ, bacon bits, cheese melt — festival comfort.",
    price: "€10,00",
    category: "Loaded Fries",
  },
  {
    id: "flame-fries",
    name: "Flame Fries",
    description: "Spicy dust, jalapeño, aioli — vuur op je tray.",
    price: "€9,50",
    category: "Loaded Fries",
    spicy: 2,
  },
  {
    id: "dirty-cheese-fries",
    name: "Dirty Cheese Fries",
    description: "Dubbele cheese, crispy topping, GG finish — messy op het juiste niveau.",
    price: "€10,00",
    category: "Loaded Fries",
  },
  {
    id: "crispy-chicken-bites",
    name: "Crispy Chicken Bites",
    description: "Knapperig van buiten, juicy van binnen — dip naar keuze.",
    price: "€8,50",
    category: "Snacks",
    popular: true,
  },
  {
    id: "loaded-frikandel",
    name: "Loaded Frikandel Special",
    description: "Street classic, loaded toppings — NL energy.",
    price: "€7,50",
    category: "Snacks",
  },
  {
    id: "chili-cheese",
    name: "Chili Cheese Snacks",
    description: "Melty cheese, chili kick, snackable format.",
    price: "€7,00",
    category: "Snacks",
    spicy: 2,
  },
  {
    id: "onion-rings",
    name: "Crunchy Onion Rings",
    description: "Golden crunch — perfect naast je smash.",
    price: "€6,00",
    category: "Snacks",
  },
  {
    id: "lemonade",
    name: "Fresh Lemonade",
    description: "Citrus, mint, crushed ice — reset tussen bites.",
    price: "€4,00",
    category: "Drinks",
  },
  {
    id: "cola",
    name: "Ice Cold Cola",
    description: "Classic pairing — ijskoud.",
    price: "€3,00",
    category: "Drinks",
  },
];

export const featuredHighlights = [
  {
    title: "Smash Burgers",
    description: "Smaak, kwaliteit, heet van de grill — waar je voor terugkomt.",
    image: foodImage(1639562, 900),
  },
  {
    title: "Loaded Fries",
    description: "Lagen toppings, cheese, attitude — delen mag, hoeven niet.",
    image: foodImage(3616760, 900),
  },
  {
    title: "Snacks",
    description: "Bites, crunch, late-night hits — perfect naast de main.",
    image: foodImage(2342121, 900),
  },
  {
    title: "Specials",
    description: "Seizoenslijntjes en loaded specials — volg ons voor de drop.",
    image: foodImage(5771896, 900),
  },
] as const;
