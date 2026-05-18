import { site } from "@/lib/site";

/** Vooringevulde WhatsApp-berichten per pagina / intent */
export const WHATSAPP_MESSAGES = {
  home: "Hoi Grill Gasten, ik wil graag meer info over jullie foodtruck.",
  zakelijk: "Hoi Grill Gasten, ik wil een offerte voor een bedrijfsevent.",
  festival: "Hoi Grill Gasten, ik heb interesse in een festivalboeking.",
  bruiloft: "Hoi Grill Gasten, ik wil catering voor een bruiloft.",
  foodtruck: "Hoi Grill Gasten, ik wil graag jullie foodtruck boeken.",
  contact: "Hoi Grill Gasten, ik heb een vraag.",
  footer: "Hoi Grill Gasten, ik wil graag meer informatie.",
  catering: "Hoi Grill Gasten, ik wil graag een offerte voor catering.",
  menu: "Hoi Grill Gasten, ik wil graag meer info over jullie menu en boekingen.",
  about: "Hoi Grill Gasten, ik wil graag meer over jullie weten en een event bespreken.",
} as const;

export type WhatsAppIntent = keyof typeof WHATSAPP_MESSAGES;

export function whatsappUrlWithPrefilledText(whatsappHref: string, text: string): string {
  const maxChars = 3800;
  const clipped =
    text.length > maxChars ? `${text.slice(0, maxChars)}\n\n… (bericht ingekort)` : text;
  const url = new URL(whatsappHref);
  url.searchParams.set("text", clipped);
  return url.toString();
}

export function getWhatsAppHref(intent: WhatsAppIntent = "home"): string {
  return whatsappUrlWithPrefilledText(site.whatsapp, WHATSAPP_MESSAGES[intent]);
}

/** Map pathname → standaard WhatsApp-intent */
export function whatsappIntentFromPath(pathname: string): WhatsAppIntent {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/zakelijk")) return "zakelijk";
  if (pathname.startsWith("/festival")) return "festival";
  if (pathname.startsWith("/foodtruck")) return "foodtruck";
  if (pathname.startsWith("/contact")) return "contact";
  if (pathname.startsWith("/catering")) return "catering";
  if (pathname.startsWith("/menu")) return "menu";
  if (pathname.startsWith("/about")) return "about";
  return "home";
}
