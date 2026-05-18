import {
  Building2,
  Heart,
  Music2,
  PartyPopper,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/lib/site";

export type BookEventCard = {
  title: string;
  body: string;
  href: string;
  icon: LucideIcon;
};

export const bookEventCards: BookEventCard[] = [
  {
    title: "Festivals",
    body: "Mainstage-energie, rijen die doorlopen — smash en loaded classics die blijven hangen.",
    href: "/festival",
    icon: Music2,
  },
  {
    title: "Bedrijfsfeesten",
    body: "Premium streetfood voor teams die iets memorabels verdienen — strak, snel, geen gedoe.",
    href: "/zakelijk",
    icon: Building2,
  },
  {
    title: "Bruiloften",
    body: "Late-night loaded bites en smash na het feest — comfort food met luxe uitstraling.",
    href: "/catering#booking",
    icon: Heart,
  },
  {
    title: "Privéfeesten",
    body: "Verjaardagen, tuinfeesten, openingen — wij brengen de grill naar jouw gasten.",
    href: "/catering",
    icon: PartyPopper,
  },
  {
    title: "Foodtruck op locatie",
    body: "Volledige truck op locatie — branding, sfeer en premium BBQ waar jij wilt.",
    href: "/foodtruck",
    icon: Sparkles,
  },
];

export const homeStats = [
  { label: "Focus", value: "Premium BBQ" },
  { label: "Regio", value: "Zuid-Holland" },
  { label: "Inzet", value: "Heel Nederland" },
] as const;

export const homeFaqs = [
  {
    q: "Wat kost een foodtruck of BBQ-catering?",
    a: "Dat hangt af van het aantal gasten, de locatie, de duur en het menu. Vraag een offerte aan via catering — Mike en Matthijs reageren snel via WhatsApp met een scherp voorstel.",
  },
  {
    q: "Waar zijn jullie inzetbaar?",
    a: "Onze thuisbasis is de Hoeksche Waard. Standaard inzetbaar in Rotterdam, Zuid-Holland en door heel Nederland voor festivals en events.",
  },
  {
    q: "Wat is de minimale afname?",
    a: "Dat verschilt per event. Neem contact op met datum en aantal gasten — wij schalen de opstelling mee.",
  },
  {
    q: "Kunnen jullie op festivals en grote drukte draaien?",
    a: "Ja. Festival-DNA, snelle service, premium kwaliteit en ervaring met drukke shifts en late night.",
  },
  {
    q: "Hoe boek ik het snelst?",
    a: `WhatsApp of bel ${site.phoneDisplay} voor beschikbaarheid. Via het cateringformulier ontvang je een uitgewerkte offerte.`,
  },
] as const;
