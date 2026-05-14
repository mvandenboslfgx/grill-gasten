/**
 * Geen cijfers of platforms — alleen echte, event-gebaseerde quotes (structuur voor later Trustpilot / Google).
 */
export type Testimonial = {
  id: string;
  quote: string;
  context: string;
  attribution: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Snelle queue, insane smash crust — gasten bleven terugkomen tot de laatste track.",
    context: "Festival · late night",
    attribution: "Eventorganisator · Zuid-Holland",
  },
  {
    id: "t2",
    quote:
      "Duidelijke communicatie vooraf en op de dag zelf: crew op tijd, strakke service, zero gedoe.",
    context: "Catering · bedrijfsfeest",
    attribution: "Locatiemanager",
  },
  {
    id: "t3",
    quote:
      "Loaded fries en smash naast de mainstage — precies de energy die we zochten.",
    context: "Outdoor · hoofdprogramma",
    attribution: "Festival production",
  },
];

export const trustInzetbaar = [
  "Festivals",
  "Catering",
  "Markten",
  "Bedrijfsfeesten",
  "Sportevents",
  "Late-night",
] as const;
