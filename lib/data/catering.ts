export type CateringPackage = {
  id: string;
  name: string;
  priceFrom: string;
  blurb: string;
  perks: string[];
};

export const cateringPackages: CateringPackage[] = [
  {
    id: "street",
    name: "Street Set",
    priceFrom: "Vanaf €850",
    blurb: "Compact setup voor private parties en brand activations.",
    perks: ["Tot 75 gasten", "2 uur service", "Signature menu", "Branded servetten"],
  },
  {
    id: "festival",
    name: "Festival Mode",
    priceFrom: "Vanaf €2.400",
    blurb: "High-throughput voor drukke events en late-night crowds.",
    perks: ["Tot 250 gasten", "Extended hours", "Custom toppings bar", "Dedicated crew"],
  },
  {
    id: "lux",
    name: "Luxury Lane",
    priceFrom: "Op aanvraag",
    blurb: "White-glove catering met premium plating en paired bites.",
    perks: ["Curated menu", "Sommelier/mocktail pairing", "Full styling", "On-site chef"],
  },
];

export const cateringFaqs = [
  {
    q: "Hoe ver van tevoren moet ik boeken?",
    a: "Voor festivals en grote events adviseren we minimaal 6–8 weken. Kleinere boekingen vaak binnen 2–3 weken mogelijk.",
  },
  {
    q: "Kunnen jullie vegetarische opties meenemen?",
    a: "Ja. We bouwen graag een vegetarische smash line naast onze classics — even lekker, even GG.",
  },
  {
    q: "Wat hebben jullie nodig op locatie?",
    a: "Stroom (16A+), waterpunt in de buurt en voldoende opstellingsruimte voor truck + gastenflow. We nemen de rest mee.",
  },
  {
    q: "Reizen jullie door heel Nederland?",
    a: "Ja. Hoeksche Waard is onze basis, maar we rijden door heel Nederland — en op aanvraag verder.",
  },
] as const;
