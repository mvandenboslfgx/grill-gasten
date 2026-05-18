export type InquiryType = "booking" | "contact";

export type InquiryPayload = {
  type: InquiryType;
  name: string;
  phone: string;
  email: string;
  eventType?: string;
  location?: string;
  date?: string;
  guests?: string;
  message?: string;
  subject?: string;
  /** Honeypot — moet leeg blijven */
  company?: string;
};

export type InquiryResult =
  | { ok: true; channel: "resend" | "formspree" }
  | { ok: false; error: string; code?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInquiry(body: unknown): { data?: InquiryPayload; error?: string } {
  if (!body || typeof body !== "object") {
    return { error: "Ongeldig verzoek." };
  }
  const raw = body as Record<string, unknown>;

  if (String(raw.company ?? "").trim()) {
    return { error: "Spam gedetecteerd." };
  }

  const type = raw.type === "contact" ? "contact" : raw.type === "booking" ? "booking" : null;
  if (!type) {
    return { error: "Ongeldig formuliertype." };
  }

  const name = String(raw.name ?? "").trim();
  const phone = String(raw.phone ?? "").trim();
  const email = String(raw.email ?? "").trim();
  const message = String(raw.message ?? "").trim();

  if (name.length < 2) {
    return { error: "Vul je naam in." };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { error: "Vul een geldig e-mailadres in." };
  }
  if (type === "booking" && phone.length < 8) {
    return { error: "Vul een geldig telefoonnummer in." };
  }
  if (type === "contact" && message.length < 10) {
    return { error: "Vul een bericht van minimaal 10 tekens in." };
  }

  const data: InquiryPayload = {
    type,
    name,
    phone,
    email,
    eventType: String(raw.eventType ?? "").trim() || undefined,
    location: String(raw.location ?? "").trim() || undefined,
    date: String(raw.date ?? "").trim() || undefined,
    guests: String(raw.guests ?? "").trim() || undefined,
    message: message || undefined,
    subject: String(raw.subject ?? "").trim() || undefined,
  };

  if (type === "booking") {
    if (!data.eventType) return { error: "Kies een type event." };
    if (!data.location) return { error: "Vul een locatie in." };
    if (!data.date) return { error: "Vul een datum in." };
    if (!data.guests) return { error: "Vul het aantal personen in." };
  }

  return { data };
}

export function formatInquiryEmail(payload: InquiryPayload): { subject: string; text: string; html: string } {
  const label = payload.type === "booking" ? "Boekingsaanvraag" : "Contactbericht";
  const subject =
    payload.type === "booking"
      ? `[Grill Gasten] ${label} — ${payload.name} (${payload.eventType})`
      : `[Grill Gasten] ${label} — ${payload.name}`;

  const lines = [
    label,
    "—".repeat(40),
    `Naam: ${payload.name}`,
    `Telefoon: ${payload.phone || "—"}`,
    `E-mail: ${payload.email}`,
    ...(payload.type === "booking"
      ? [
          `Type event: ${payload.eventType}`,
          `Locatie: ${payload.location}`,
          `Datum: ${payload.date}`,
          `Aantal personen: ${payload.guests}`,
        ]
      : [`Onderwerp: ${payload.subject || "—"}`]),
    "",
    "Bericht:",
    payload.message || "—",
  ];

  const text = lines.join("\n");
  const html = lines.map((l) => `<p>${l.replace(/</g, "&lt;")}</p>`).join("");

  return { subject, text, html };
}
