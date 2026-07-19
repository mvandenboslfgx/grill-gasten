import { site } from "@/lib/site";

/** Copy for the closed `/bestellen` experience (orderingEnabled === false). */
export const CLOSED_ORDERING_COPY = {
  badge: "Nog niet beschikbaar",
  h1: "Online bestellen komt binnenkort",
  intro:
    "We zetten de laatste punten op de i. Tot die tijd kun je ons menu bekijken en direct contact opnemen via WhatsApp.",
  statusLine: "De online bestelomgeving is momenteel nog gesloten.",
  primaryCta: "Bestel of vraag via WhatsApp",
  secondaryCta: "Bekijk het menu",
  metaTitle: "Bestellen bij Grill Gasten | Binnenkort online",
  metaDescription:
    "Online bestellen bij Grill Gasten komt binnenkort beschikbaar. Bekijk nu het menu of neem direct contact op via WhatsApp.",
  benefits: [
    {
      title: "Direct contact",
      body: "Stuur je vraag of bestelling via WhatsApp.",
    },
    {
      title: "Menu alvast bekijken",
      body: "Bekijk onze burgers, loaded fries en extra’s.",
    },
    {
      title: "Binnenkort online",
      body: "De volledige bestelomgeving wordt later bewust geopend.",
    },
  ],
  contactHeading: "Contact",
  phoneDisplay: site.phoneDisplay,
  email: site.email,
} as const;
