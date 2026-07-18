export const site = {
  name: "Grill Gasten",
  tagline: "Verse smashburgers, loaded fries en spicy chicken. Snel besteld, heet bereid.",
  description:
    "Grill Gasten — smashburgers, loaded fries en spicy chicken uit de Hoeksche Waard. Bestel online of vraag naar catering voor je feest.",
  metaDescriptionHome:
    "Smashburgers bestellen bij Grill Gasten in de Hoeksche Waard. Double smash, loaded fries en spicy chicken — bestel online en haal af.",
  founders: "Mike en Matthijs",
  region: "Hoeksche Waard",
  serviceArea: "Rotterdam · Zuid-Holland · heel Nederland",
  url: "https://grillgasten.eu",
  logo: "/brand/grill-gasten-logo.png",
  slogan: "Smaak. Passie. Samen genieten.",
  /** Boekingen & formulieren — niet wijzigen zonder akkoord eigenaar */
  email: "info@grillgasten.eu",
  phoneDisplay: "+31 6 49 56 56 98",
  phoneTel: "tel:+31649565698",
  phoneE164: "+31649565698",
  whatsapp: "https://wa.me/31649565698",
  instagram: "https://www.instagram.com/grill_gasten/",
  tiktok: "https://www.tiktok.com/@grillgasten1",
  address: "Regio Hoeksche Waard — inzetbaar door heel Nederland",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/bestellen", label: "Bestellen" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "Over ons" },
  { href: "/contact", label: "Contact" },
] as const;
