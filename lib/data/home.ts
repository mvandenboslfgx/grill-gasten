import {
  Building2,
  Heart,
  PartyPopper,
  Users,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/lib/site";

export type BookEventCard = {
  title: string;
  body: string;
  href: string;
  icon: LucideIcon;
};

/** Catering-gelegenheden — alle links naar /catering (geen foodtruck-primary). */
export const bookEventCards: BookEventCard[] = [
  {
    title: "Bedrijfsmomenten",
    body: "Smashburgers en loaded fries voor teams, borrels en openingen — strak en zonder gedoe.",
    href: "/catering",
    icon: Building2,
  },
  {
    title: "Bruiloften",
    body: "Late-night bites na het feest — comfort food met een premium uitstraling.",
    href: "/catering#booking",
    icon: Heart,
  },
  {
    title: "Privéfeesten",
    body: "Verjaardagen, tuinfeesten en buurtfeesten — we denken mee over menu en aantallen.",
    href: "/catering",
    icon: PartyPopper,
  },
  {
    title: "Groepen & catering",
    body: "Vraag vrijblijvend wat mogelijk is voor jouw gelegenheid. Prijs op aanvraag.",
    href: "/catering#booking",
    icon: Users,
  },
];

export const homeStats = [
  { label: "Focus", value: "Smashburgers" },
  { label: "Regio", value: site.region },
  { label: "Service", value: "Afhalen & bezorgen" },
] as const;

/** Legacy FAQ-set (niet op homepage; HomeFaqSection heeft eigen copy). */
export const homeFaqs = [
  {
    q: "Wat kost catering van Grill Gasten?",
    a: "Dat hangt af van het aantal gasten, de locatie, de duur en het menu. Vraag een offerte via catering of WhatsApp — Mike en Matthijs reageren snel.",
  },
  {
    q: "Waar kunnen jullie cateren?",
    a: `Onze thuisbasis is de ${site.region}. Voor catering op locatie overleggen we wat haalbaar is voor jouw datum en adres.`,
  },
  {
    q: "Wat is de minimale afname?",
    a: "Dat verschilt per gelegenheid. Neem contact op met datum en aantal gasten — dan kijken we mee.",
  },
  {
    q: "Hoe boek ik catering het snelst?",
    a: `WhatsApp of bel ${site.phoneDisplay} voor een snelle check. Via het cateringformulier kun je een uitgewerkte aanvraag sturen.`,
  },
] as const;
