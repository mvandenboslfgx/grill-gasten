/**
 * Rate limiting: gedeelde Supabase RPC in productie, in-memory alleen als lokale fallback.
 *
 * Env:
 *   RATE_LIMIT_BACKEND=supabase  → probeer RPC check_rate_limit (fail-closed bij fout)
 *   anders / lokaal zonder Supabase → in-memory Map (niet gedeeld over instances)
 *
 * Migratie: supabase/migrations/20260718230000_delivery_safety_fix.sql
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { ok: true };
}

function shouldUseSharedLimiter(): boolean {
  const backend = (process.env.RATE_LIMIT_BACKEND ?? "").trim().toLowerCase();
  if (backend === "memory") return false;
  if (backend === "supabase") return true;
  // Productie (Vercel): standaard gedeelde limiter wanneer Supabase beschikbaar is
  return Boolean(process.env.VERCEL) && isSupabaseConfigured();
}

async function supabaseRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: true } | { ok: false; retryAfterSec: number } | { error: true }> {
  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db.rpc("check_rate_limit", {
      p_key: key.slice(0, 200),
      p_limit: limit,
      p_window_ms: windowMs,
    });
    if (error) return { error: true };
    const row = (Array.isArray(data) ? data[0] : data) as
      | { allowed?: boolean; retry_after_sec?: number }
      | null;
    if (!row) return { error: true };
    if (row.allowed) return { ok: true };
    return { ok: false, retryAfterSec: Math.max(1, Number(row.retry_after_sec) || 60) };
  } catch {
    return { error: true };
  }
}

/**
 * Sync wrapper behoudt bestaande call sites.
 * Bij gedeelde backend: fire-and-forget sync via de async helper is niet mogelijk —
 * gebruik `rateLimitAsync` in API routes.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  // Sync pad: altijd memory (lokale fallback). Routes moeten rateLimitAsync gebruiken.
  return memoryRateLimit(key, limit, windowMs);
}

/** Productie-rate-limit: gedeelde Supabase RPC of memory; fail-closed bij RPC-fout. */
export async function rateLimitAsync(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  if (!shouldUseSharedLimiter()) {
    return memoryRateLimit(key, limit, windowMs);
  }

  const shared = await supabaseRateLimit(key, limit, windowMs);
  if ("error" in shared) {
    // Fail-closed: geen request doorlaten wanneer gedeelde limiter down is
    console.error("[rate-limit] shared backend unavailable", { code: "RATE_LIMIT_BACKEND_DOWN" });
    return { ok: false, retryAfterSec: 30 };
  }
  return shared;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
