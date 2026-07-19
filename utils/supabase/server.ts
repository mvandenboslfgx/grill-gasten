import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function requirePublicEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase publishable env ontbreekt (URL / PUBLISHABLE_KEY).");
  }
  return { supabaseUrl, supabaseKey };
}

export async function createClient(
  cookieStore?: Awaited<ReturnType<typeof cookies>>,
) {
  const { supabaseUrl, supabaseKey } = requirePublicEnv();
  const store = cookieStore ?? (await cookies());

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — middleware refreshes sessions.
        }
      },
    },
  });
}
