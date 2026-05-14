/**
 * Bouwt een wa.me-URL met vooringevulde tekst (max. ~WhatsApp-limiet).
 * `whatsappHref` is bv. `https://wa.me/31612345678` uit `site.whatsapp`.
 */
export function whatsappUrlWithPrefilledText(whatsappHref: string, text: string): string {
  const maxChars = 3800;
  const clipped =
    text.length > maxChars ? `${text.slice(0, maxChars)}\n\n… (bericht ingekort)` : text;
  const url = new URL(whatsappHref);
  url.searchParams.set("text", clipped);
  return url.toString();
}
