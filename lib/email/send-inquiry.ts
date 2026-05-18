import { site } from "@/lib/site";
import type { InquiryPayload, InquiryResult } from "@/lib/inquiry";
import { formatInquiryEmail } from "@/lib/inquiry";
import { inquiryErrorForUser, logInquiryError } from "@/lib/inquiry-errors";

function isResendConfigured(): boolean {
  const key = process.env.RESEND_API_KEY?.trim();
  return Boolean(key && key.startsWith("re_") && !key.includes("xxxx"));
}

/** Form-ID (xaqknnzj) of volledige URL uit Formspree-dashboard. */
export function getFormspreeEndpoint(): string | null {
  const raw = process.env.FORMSPREE_FORM_ID?.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/$/, "");
  const id = raw.replace(/^.*\/f\//, "").replace(/\/$/, "");
  return id ? `https://formspree.io/f/${id}` : null;
}

async function sendViaResend(payload: InquiryPayload): Promise<InquiryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logInquiryError("NO_RESEND", "RESEND_API_KEY missing");
    return { ok: false, error: inquiryErrorForUser("NO_RESEND"), code: "NO_RESEND" };
  }

  const { subject, html, text } = formatInquiryEmail(payload);
  const from = process.env.RESEND_FROM ?? `Grill Gasten <onboarding@resend.dev>`;
  const to = process.env.INQUIRY_TO ?? site.email;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    logInquiryError("RESEND_FAILED", `${res.status} ${err}`);
    return { ok: false, error: inquiryErrorForUser("RESEND_FAILED"), code: "RESEND_FAILED" };
  }

  return { ok: true, channel: "resend" };
}

async function sendViaFormspree(payload: InquiryPayload): Promise<InquiryResult> {
  const endpoint = getFormspreeEndpoint();
  if (!endpoint) {
    logInquiryError("NO_FORMSPREE", "FORMSPREE_FORM_ID missing");
    return { ok: false, error: inquiryErrorForUser("NO_FORMSPREE"), code: "NO_FORMSPREE" };
  }

  const { subject, text } = formatInquiryEmail(payload);
  const body =
    payload.message?.trim() ||
    [text, payload.type === "booking" ? `Type: ${payload.eventType}` : payload.subject]
      .filter(Boolean)
      .join("\n\n");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _subject: subject,
      _replyto: payload.email,
      _format: "plain",
      type: payload.type,
      name: payload.name,
      phone: payload.phone || undefined,
      email: payload.email,
      eventType: payload.eventType,
      location: payload.location,
      date: payload.date,
      guests: payload.guests,
      subject: payload.subject,
      message: body,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    logInquiryError("FORMSPREE_FAILED", `${res.status} ${detail}`);
    return { ok: false, error: inquiryErrorForUser("FORMSPREE_FAILED"), code: "FORMSPREE_FAILED" };
  }

  return { ok: true, channel: "formspree" };
}

export async function deliverInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  if (isResendConfigured()) {
    const result = await sendViaResend(payload);
    if (result.ok) return result;
    if (getFormspreeEndpoint()) {
      logInquiryError("RESEND_FALLBACK", "trying Formspree");
      return sendViaFormspree(payload);
    }
    return result;
  }

  if (getFormspreeEndpoint()) {
    return sendViaFormspree(payload);
  }

  logInquiryError(
    "NO_PROVIDER",
    "Set RESEND_API_KEY or FORMSPREE_FORM_ID in environment (e.g. Vercel / .env.local)",
  );

  return {
    ok: false,
    error: inquiryErrorForUser("NO_PROVIDER"),
    code: "NO_PROVIDER",
  };
}
