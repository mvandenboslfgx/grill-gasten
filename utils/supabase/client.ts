import { createBrowserClient } from "@supabase/ssr";

function requirePublicEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase publishable env ontbreekt (URL / PUBLISHABLE_KEY).");
  }
  return { supabaseUrl, supabaseKey };
}

export function createClient() {
  const { supabaseUrl, supabaseKey } = requirePublicEnv();
  return createBrowserClient(supabaseUrl, supabaseKey);
}
