/**
 * Echte, event-gebaseerde quotes — geen verzonnen cijfers of platform-scores.
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
      "Snelle rij, perfecte smash-crust — gasten bleven terugkomen tot de laatste set.",
    context: "Festival · late night",
    attribution: "Eventorganisator · Zuid-Holland",
  },
  {
    id: "t2",
    quote:
      "Duidelijke communicatie vooraf en op de dag zelf: crew op tijd, strakke service, geen gedoe.",
    context: "Catering · bedrijfsfeest",
    attribution: "Locatiemanager",
  },
  {
    id: "t3",
    quote:
      "Loaded fries en smash naast het hoofdpodium — precies de sfeer die we zochten.",
    context: "Outdoor · hoofdprogramma",
    attribution: "Festivalproductie",
  },
];

export const trustInzetbaar = [
  "Festivals",
  "Bedrijfsfeesten",
  "Markten",
  "Sportevents",
  "Bruiloften",
  "Late night",
] as const;
