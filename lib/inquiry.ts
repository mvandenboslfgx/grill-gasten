export type InquiryType = "booking" | "contact" | "preorder" | "rewards";

export type InquiryPayload = {
  type: InquiryType;
  name: string;
  phone: string;
  email: string;
  eventType?: string;
  location?: string;
  date?: string;
  time?: string;
  guests?: string;
  budget?: string;
  company?: string;
  message?: string;
  subject?: string;
  orderId?: string;
  /** Honeypot — moet leeg blijven */
  website?: string;
};

export type InquiryResult =
  | { ok: true; channel: "resend" | "formspree"; orderId?: string; qrDataUrl?: string }
  | { ok: false; error: string; code?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseType(raw: unknown): InquiryType | null {
  const t = String(raw ?? "");
  if (t === "booking" || t === "contact" || t === "preorder" || t === "rewards") return t;
  return null;
}

export function validateInquiry(body: unknown): { data?: InquiryPayload; error?: string } {
  if (!body || typeof body !== "object") {
    return { error: "Ongeldig verzoek." };
  }
  const raw = body as Record<string, unknown>;

  if (String(raw.website ?? "").trim()) {
    return { error: "Spam gedetecteerd." };
  }

  const type = parseType(raw.type);
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

  if (type === "contact" && message.length < 10) {
    return { error: "Vul een bericht van minimaal 10 tekens in." };
  }

  if ((type === "booking" || type === "preorder") && phone.length < 8) {
    return { error: "Vul een geldig telefoonnummer in." };
  }

  const data: InquiryPayload = {
    type,
    name,
    phone,
    email,
    company: String(raw.company ?? "").trim() || undefined,
    eventType: String(raw.eventType ?? "").trim() || undefined,
    location: String(raw.location ?? "").trim() || undefined,
    date: String(raw.date ?? "").trim() || undefined,
    time: String(raw.time ?? "").trim() || undefined,
    guests: String(raw.guests ?? "").trim() || undefined,
    budget: String(raw.budget ?? "").trim() || undefined,
    message: message || undefined,
    subject: String(raw.subject ?? "").trim() || undefined,
    orderId: String(raw.orderId ?? "").trim() || undefined,
  };

  if (type === "booking") {
    if (!data.eventType) return { error: "Kies een type event." };
    if (!data.location) return { error: "Vul een locatie in." };
    if (!data.date) return { error: "Vul een datum in." };
    if (!data.guests) return { error: "Vul het aantal personen in." };
  }

  if (type === "preorder") {
    if (!data.date) return { error: "Kies een datum." };
    if (!data.time) return { error: "Kies een tijdslot." };
    if (!data.message || data.message.length < 8) return { error: "Je winkelmand is leeg." };
  }

  if (type === "rewards" && !data.email) {
    return { error: "E-mail is verplicht." };
  }

  return { data };
}

const TYPE_LABELS: Record<InquiryType, string> = {
  booking: "Boekingsaanvraag",
  contact: "Contactbericht",
  preorder: "Pre-order / afhalen",
  rewards: "Grill Rewards aanmelding",
};

export function formatInquiryEmail(payload: InquiryPayload): { subject: string; text: string; html: string } {
  const label = TYPE_LABELS[payload.type];
  const subject =
    payload.type === "booking"
      ? `[Grill Gasten] ${label} — ${payload.name} (${payload.eventType})`
      : payload.type === "preorder"
        ? `[Grill Gasten] ${label} — ${payload.orderId ?? payload.name}`
        : `[Grill Gasten] ${label} — ${payload.name}`;

  const lines = [
    label,
    "—".repeat(40),
    `Naam: ${payload.name}`,
    ...(payload.company ? [`Bedrijf: ${payload.company}`] : []),
    `Telefoon: ${payload.phone || "—"}`,
    `E-mail: ${payload.email}`,
    ...(payload.orderId ? [`Order: ${payload.orderId}`] : []),
    ...(payload.type === "booking" || payload.type === "preorder"
      ? [
          `Type: ${payload.eventType ?? "Afhalen"}`,
          `Locatie: ${payload.location ?? "—"}`,
          `Datum: ${payload.date ?? "—"}`,
          ...(payload.time ? [`Tijd: ${payload.time}`] : []),
          ...(payload.guests ? [`Personen: ${payload.guests}`] : []),
          ...(payload.budget ? [`Budget: ${payload.budget}`] : []),
        ]
      : [`Onderwerp: ${payload.subject || "—"}`]),
    "",
    "Bericht / bestelling:",
    payload.message || "—",
  ];

  const text = lines.join("\n");
  const html = lines.map((l) => `<p>${l.replace(/</g, "&lt;")}</p>`).join("");

  return { subject, text, html };
}
