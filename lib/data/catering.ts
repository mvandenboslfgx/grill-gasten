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
    priceFrom: "Vanaf € 850",
    blurb: "Compacte setup voor privéfeesten en merkactivaties.",
    perks: ["Tot 75 gasten", "2 uur service", "Signatuurmenu", "Branded servetten"],
  },
  {
    id: "festival",
    name: "Festival Mode",
    priceFrom: "Vanaf € 2.400",
    blurb: "Hoge doorstroom voor drukke events en late-night drukte.",
    perks: ["Tot 250 gasten", "Verlengde service", "Toppingsbar op maat", "Eigen crew"],
  },
  {
    id: "lux",
    name: "Luxury Lane",
    priceFrom: "Op aanvraag",
    blurb: "Premium catering met verfijnde presentatie en geselecteerde bites.",
    perks: ["Menu op maat", "Mocktail- of drankbegeleiding", "Volledige styling", "Chef op locatie"],
  },
];

export const cateringFaqs = [
  {
    q: "Hoe ver van tevoren moet ik boeken?",
    a: "Voor festivals en grote events adviseren wij minimaal 6 tot 8 weken. Kleinere boekingen zijn vaak binnen 2 tot 3 weken mogelijk.",
  },
  {
    q: "Kunnen jullie vegetarische opties meenemen?",
    a: "Ja. Wij bouwen graag een vegetarische smashlijn naast onze klassiekers — even lekker, met GG-attitude.",
  },
  {
    q: "Wat hebben jullie nodig op locatie?",
    a: "Stroom (16A of meer), een waterpunt in de buurt en voldoende ruimte voor de truck en gastenstroom. De rest nemen wij mee.",
  },
  {
    q: "Rijden jullie door heel Nederland?",
    a: "Ja. De Hoeksche Waard is onze basis; we rijden door heel Nederland en op aanvraag verder.",
  },
] as const;
