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
    blurb: "Compacte setup voor privéfeesten en kleinere groepen.",
    perks: ["Tot 75 gasten", "2 uur service", "Signatuurmenu", "Overleg op maat"],
  },
  {
    id: "crowd",
    name: "Crowd Mode",
    priceFrom: "Vanaf € 2.400",
    blurb: "Hogere doorstroom voor grotere gelegenheden.",
    perks: ["Tot 250 gasten", "Verlengde service", "Toppings op maat", "Eigen crew"],
  },
  {
    id: "lux",
    name: "Luxury Lane",
    priceFrom: "Op aanvraag",
    blurb: "Premium catering met verfijnde presentatie en geselecteerde bites.",
    perks: ["Menu op maat", "Drankbegeleiding in overleg", "Volledige styling", "Chef op locatie"],
  },
];

export const cateringFaqs = [
  {
    q: "Hoe ver van tevoren moet ik boeken?",
    a: "Voor grotere gelegenheden adviseren wij minimaal 6 tot 8 weken. Kleinere boekingen zijn vaak binnen 2 tot 3 weken mogelijk — even checken via WhatsApp.",
  },
  {
    q: "Kunnen jullie vegetarische opties meenemen?",
    a: "Ja. We bouwen graag een vegetarische smashlijn naast onze klassiekers.",
  },
  {
    q: "Wat hebben jullie nodig op locatie?",
    a: "Dat hangt af van de opzet. We stemmen stroom, ruimte en logistiek vooraf met je af.",
  },
  {
    q: "Waar cateren jullie?",
    a: "De Hoeksche Waard is onze basis. Voor locaties daarbuiten overleggen we wat haalbaar is.",
  },
] as const;
