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

export const foodtruckLanding: LandingContent = {
  slug: "foodtruck",
  metaTitle: "Foodtruck huren",
  metaDescription:
    "Premium BBQ foodtruck huren — Grill Gasten voor festivals, events en privé. Smashburgers, loaded fries, crew inbegrepen. Rotterdam, Zuid-Holland en heel Nederland.",
  eyebrow: "Foodtruck op locatie",
  title: "Premium BBQ foodtruck",
  subtitle: "Volledige truck op jouw locatie — branding, vuur en streetfood die je event tillen.",
  heroImage: IMG_FOOD_TRUCK,
  heroAlt: "Grill Gasten foodtruck bij een event",
  highlights: [
    "Eigen truck en crew",
    "Smash- en loaded-menu",
    "Festivals en privé",
    "Heel Nederland",
    "Snelle offerte via WhatsApp",
  ],
  body: [
    "Je huurt meer dan een keuken op wielen: je krijgt Mike en Matthijs met festivalervaring, strakke service en een menu dat rijen in beweging houdt.",
    "Van tuinfeest tot mainstage — wij schalen opstelling, voorraad en tempo mee met het aantal gasten.",
  ],
  ctaTitle: "Foodtruck beschikbaar?",
  whatsappIntent: "foodtruck",
};

export const zakelijkLanding: LandingContent = {
  slug: "zakelijk",
  metaTitle: "Zakelijke catering en bedrijfsfeest",
  metaDescription:
    "BBQ-catering voor bedrijfsfeesten, teamevents en openingen. Premium streetfood foodtruck — Grill Gasten, Zuid-Holland en heel Nederland.",
  eyebrow: "Zakelijk en teams",
  title: "BBQ-catering voor bedrijven",
  subtitle: "Premium streetfood zonder saaie bedrijfstaal — wel strak, snel en onvergetelijk.",
  heroImage: FOOD.loadedTray.src,
  heroAlt: "Loaded fries — premium catering streetfood",
  highlights: [
    "Teamevents en openingen",
    "Facturatie en planning",
    "Premium uitstraling",
    "Flexibel menu",
    "Rotterdam en heel Nederland",
  ],
  body: [
    "Medewerkers onthouden geen broodjesmand — ze onthouden de grill, de cheese pull en de sfeer bij de truck.",
    "Wij denken mee over timing, doorstroom en dieetwensen, zodat jouw event van de eerste tot de laatste burger professioneel aanvoelt.",
  ],
  ctaTitle: "Offerte voor jouw bedrijfsevent?",
  whatsappIntent: "zakelijk",
};

export const festivalLanding: LandingContent = {
  slug: "festival",
  metaTitle: "Festival foodtruck",
  metaDescription:
    "Festival foodtruck met premium smashburgers en loaded fries. Grill Gasten — ervaring met drukke shifts, late night en grote drukte.",
  eyebrow: "Festival-DNA",
  title: "Festival foodtruck",
  subtitle: "Mainstage-energie. Rijen die doorlopen. Smash die blijft hangen.",
  heroImage: FOOD.heroSmash.src,
  heroAlt: "Premium smashburger — festival streetfood van Grill Gasten",
  highlights: [
    "Drukke shifts en late night",
    "Snelle doorstroom",
    "Premium kwaliteit",
    "Festivalervaring",
    "Nederland en België",
  ],
  body: [
    "Wij zijn gebouwd voor lawaai, licht en hongerige menigtes — niet voor stille kantoorlunches.",
    "Line-up, stroom en logistiek bespreken we vooraf, zodat jij op de dag zelf geniet van volle trays en tevreden gasten.",
  ],
  ctaTitle: "Festival line-up bespreken?",
  whatsappIntent: "festival",
};
