import { getKitchenSecret } from "@/lib/supabase/env";

export function verifyKitchenRequest(request: Request): boolean {
  const secret = getKitchenSecret();
  if (!secret) return false;
  const header = request.headers.get("x-kitchen-key");
  const url = new URL(request.url);
  const query = url.searchParams.get("key");
  return header === secret || query === secret;
}
