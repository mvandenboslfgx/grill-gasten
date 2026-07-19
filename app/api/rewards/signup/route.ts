import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/email/send-inquiry";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { clientIp, rateLimitAsync } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = await rateLimitAsync(`rewards:${ip}`, 8, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { ok: false, error: "Te veel verzoeken. Probeer later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
      );
    }

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      website?: string;
    };

    if (String(body.website ?? "").trim()) {
      return NextResponse.json({ ok: false, error: "Spam gedetecteerd." }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Vul je naam in." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Vul een geldig e-mailadres in." }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const db = getSupabaseAdmin();
      await db.from("rewards_signups").insert({ email, name, phone: phone || null });

      const referralCode = `GG${(email.split("@")[0] ?? "member").slice(0, 6).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`;

      const { data: existing } = await db
        .from("rewards_members")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (!existing) {
        const { data: member } = await db
          .from("rewards_members")
          .insert({
            email,
            name,
            phone: phone || null,
            points: 25,
            tier: "bronze",
            referral_code: referralCode,
          })
          .select("id")
          .single();

        if (member?.id) {
          await db.from("points_ledger").insert({
            member_id: member.id,
            delta: 25,
            reason: "Welkomstbonus",
          });
        }
      }
    }

    await deliverInquiry({
      type: "rewards",
      name,
      email,
      phone,
      message: "Grill Rewards aanmelding (API)",
    });

    return NextResponse.json({ ok: true });
  } catch {
    console.error("[api/rewards/signup]", { code: "SIGNUP_FAILED" });
    return NextResponse.json({ ok: false, error: "Aanmelding mislukt." }, { status: 500 });
  }
}
