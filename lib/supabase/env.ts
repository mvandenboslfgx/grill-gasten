export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  return url;
}

export function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return key;
}

export function isMollieConfigured(): boolean {
  return Boolean(process.env.MOLLIE_API_KEY?.trim());
}

/**
 * Kitchen shared secret — KITCHEN_SECRET only (no ADMIN_SECRET fallback).
 * Must be ≥ 32 characters.
 */
export function getKitchenSecret(): string | null {
  const secret = process.env.KITCHEN_SECRET?.trim() || null;
  if (!secret || secret.length < 32) return null;
  return secret;
}
