import { FOOD, IMG_FOOD_TRUCK } from "@/lib/data/food-imagery";
import type { WhatsAppIntent } from "@/lib/whatsapp";

export type LandingContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  heroImage: string;
  heroAlt: string;
  highlights: readonly string[];
  body: readonly string[];
  ctaTitle: string;
  whatsappIntent: WhatsAppIntent;
};

/**
 * Legacy landings — routes /foodtruck, /zakelijk, /festival redirecten naar /catering.
 * Copy bijgewerkt zodat hergebruik of SEO-template geen foodtruck-primary claimt.
 */
export const foodtruckLanding: LandingContent = {
  slug: "foodtruck",
  metaTitle: "Catering op locatie",
  metaDescription:
    "Burgercatering van Grill Gasten — smashburgers en loaded fries voor feesten en bedrijfsmomenten. Prijs op aanvraag. Hoeksche Waard.",
  eyebrow: "Catering",
  title: "Grill Gasten op jouw locatie",
  subtitle: "Smashburgers en loaded fries voor je feest of bedrijfsmoment — offerte op maat.",
  heroImage: IMG_FOOD_TRUCK,
  heroAlt: "Grill Gasten catering — burgers en loaded fries",
  highlights: [
    "Smash- en loaded-menu",
    "Feesten en bedrijfsmomenten",
    "Prijs op aanvraag",
    "Snelle reactie via WhatsApp",
  ],
  body: [
    "Je boekt geen standaard pakket: Mike en Matthijs denken mee over aantal gasten, timing en menu.",
    "Van privéfeest tot bedrijfsmoment — we schalen mee met wat jij nodig hebt.",
  ],
  ctaTitle: "Catering beschikbaar?",
  whatsappIntent: "catering",
};

export const zakelijkLanding: LandingContent = {
  slug: "zakelijk",
  metaTitle: "Zakelijke catering",
  metaDescription:
    "Burgercatering voor bedrijfsfeesten, teamevents en openingen. Grill Gasten — smashburgers en loaded fries, prijs op aanvraag.",
  eyebrow: "Zakelijk en teams",
  title: "Catering voor bedrijven",
  subtitle: "Premium burgers voor teams — strak, snel en zonder saaie bedrijfstaal.",
  heroImage: FOOD.loadedTray.src,
  heroAlt: "Loaded fries — catering van Grill Gasten",
  highlights: [
    "Teamevents en openingen",
    "Planning en overleg",
    "Flexibel menu",
    "Hoeksche Waard en omgeving",
  ],
  body: [
    "Medewerkers onthouden de grill en de cheese pull — niet een broodjesmand.",
    "We denken mee over timing, doorstroom en dieetwensen, zodat jouw moment soepel verloopt.",
  ],
  ctaTitle: "Offerte voor jouw bedrijfsevent?",
  whatsappIntent: "zakelijk",
};

export const festivalLanding: LandingContent = {
  slug: "festival",
  metaTitle: "Catering voor evenementen",
  metaDescription:
    "Burgercatering voor evenementen met smashburgers en loaded fries. Grill Gasten — vraag vrijblijvend wat mogelijk is.",
  eyebrow: "Evenementen",
  title: "Catering voor jouw event",
  subtitle: "Smaak en tempo wanneer de drukte toeneemt — in overleg wat we kunnen leveren.",
  heroImage: FOOD.heroSmash.src,
  heroAlt: "Premium smashburger van Grill Gasten",
  highlights: [
    "Drukke momenten",
    "Snelle doorstroom",
    "Premium kwaliteit",
    "Offerte op aanvraag",
  ],
  body: [
    "Voor evenementen stemmen we menu, aantallen en logistiek vooraf af.",
    "Geen harde beloftes zonder overleg — stuur datum en verwachte gasten via WhatsApp of het formulier.",
  ],
  ctaTitle: "Evenement bespreken?",
  whatsappIntent: "festival",
};
