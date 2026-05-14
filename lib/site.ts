export const site = {
  name: "Grill Gasten",
  tagline: "Premium smashburgers, loaded snacks en festival food voor echte gasten.",
  description:
    "Grill Gasten brengt premium streetfood, smashburgers en festival vibes naar events, catering en locaties door heel Nederland.",
  /** Homepage + meta — SEO-tekst uit jullie briefing */
  metaDescriptionHome:
    "Grill Gasten uit de Hoeksche Waard brengt premium smashburgers, loaded fries en streetfood naar festivals, events, catering en locaties door heel Nederland.",
  founders: "Mike en Matthijs",
  region: "Hoeksche Waard",
  url: "https://grillgasten.eu",
  email: "hello@grillgasten.eu",
  phone: "+31 6 00 00 00 00",
  whatsapp: "https://wa.me/31600000000",
  instagram: "https://www.instagram.com/grill_gasten/",
  tiktok: "https://www.tiktok.com/@grillgasten1",
  address: "Regio Hoeksche Waard — inzetbaar door heel Nederland",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "Story" },
  { href: "/contact", label: "Contact" },
] as const;
