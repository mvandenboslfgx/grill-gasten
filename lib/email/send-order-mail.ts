import { site } from "@/lib/site";
import { logInquiryError } from "@/lib/inquiry-errors";

/** Stuur order-e-mail via Resend (geen klantgegevens in logs). */
export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || !apiKey.startsWith("re_") || apiKey.includes("xxxx")) {
    logInquiryError("NO_RESEND", "order email skipped");
    return { ok: false };
  }

  const from = process.env.RESEND_FROM ?? `Grill Gasten <onboarding@resend.dev>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        reply_to: input.replyTo,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
    if (!res.ok) {
      logInquiryError("RESEND_FAILED", `order mail ${res.status}`);
      return { ok: false };
    }
    return { ok: true };
  } catch {
    logInquiryError("RESEND_FAILED", "order mail exception");
    return { ok: false };
  }
}

export function ownerInbox(): string {
  return process.env.INQUIRY_TO?.trim() || site.email;
}
