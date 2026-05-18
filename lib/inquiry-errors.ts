/** Klantgerichte foutteksten — geen technische details naar de browser. */

export type InquiryErrorCode =
  | "NO_PROVIDER"
  | "NO_RESEND"
  | "NO_FORMSPREE"
  | "RESEND_FAILED"
  | "FORMSPREE_FAILED";

const USER_MESSAGES: Record<InquiryErrorCode, string> = {
  NO_PROVIDER:
    "Het formulier kon nu niet worden verzonden. Neem direct contact op via WhatsApp of telefoon — we reageren meestal dezelfde dag.",
  NO_RESEND:
    "Verzenden is tijdelijk niet beschikbaar. Neem direct contact op via WhatsApp of telefoon.",
  NO_FORMSPREE:
    "Verzenden is tijdelijk niet beschikbaar. Neem direct contact op via WhatsApp of telefoon.",
  RESEND_FAILED:
    "Je aanvraag kon niet per e-mail worden verstuurd. Probeer WhatsApp of bel ons — dan pakken we het meteen op.",
  FORMSPREE_FAILED:
    "Je aanvraag kon niet worden verstuurd. Probeer WhatsApp of bel ons — dan pakken we het meteen op.",
};

export const INQUIRY_FALLBACK_ERROR =
  "Verzenden is niet gelukt. Probeer WhatsApp of bel ons — we reageren meestal dezelfde dag.";

export function inquiryErrorForUser(code?: string): string {
  if (code && code in USER_MESSAGES) {
    return USER_MESSAGES[code as InquiryErrorCode];
  }
  return INQUIRY_FALLBACK_ERROR;
}

export function logInquiryError(code: string, detail?: string): void {
  console.error(`[inquiry] ${code}${detail ? `: ${detail}` : ""}`);
}
