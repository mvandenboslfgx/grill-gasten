/**
 * Server-only environment presence checks — never return secret values.
 */

export type EnvPresence = "present" | "missing" | "invalid" | "n/a";

export type OrderingEnvReport = {
  NEXT_PUBLIC_SUPABASE_URL: EnvPresence;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: EnvPresence;
  SUPABASE_SERVICE_ROLE_KEY: EnvPresence;
  KITCHEN_SECRET: EnvPresence;
  MOLLIE_API_KEY: EnvPresence;
  RESEND_API_KEY: EnvPresence;
  NEXT_PUBLIC_SITE_URL: EnvPresence;
  DELIVERY_QUOTE_SECRET: EnvPresence;
  GOOGLE_MAPS_API_KEY: EnvPresence;
  ORDER_STATUS_TOKEN_SECRET: EnvPresence;
  checkoutReady: boolean;
  pickupEnvReady: boolean;
  deliveryEnvReady: boolean;
};

function presence(
  value: string | undefined,
  opts?: { minLength?: number; prefix?: string },
): EnvPresence {
  const v = value?.trim() ?? "";
  if (!v) return "missing";
  if (opts?.minLength && v.length < opts.minLength) return "invalid";
  if (opts?.prefix && !v.startsWith(opts.prefix) && !v.startsWith("test_") && !v.startsWith("live_")) {
    // Mollie: allow test_/live_; other prefixes optional
  }
  if (opts?.prefix === "mollie" && !(v.startsWith("test_") || v.startsWith("live_"))) {
    return "invalid";
  }
  return "present";
}

export function getOrderingEnvReport(): OrderingEnvReport {
  const supabaseUrl = presence(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishable = presence(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const serviceRole = presence(process.env.SUPABASE_SERVICE_ROLE_KEY, { minLength: 20 });
  const kitchen = presence(process.env.KITCHEN_SECRET, { minLength: 32 });
  const mollie = presence(process.env.MOLLIE_API_KEY, { prefix: "mollie" });
  const resend = presence(process.env.RESEND_API_KEY);
  const siteUrl = presence(process.env.NEXT_PUBLIC_SITE_URL);
  const quoteSecret = presence(process.env.DELIVERY_QUOTE_SECRET, { minLength: 32 });
  const maps = presence(process.env.GOOGLE_MAPS_API_KEY);
  const tokenSecret = presence(process.env.ORDER_STATUS_TOKEN_SECRET, { minLength: 32 });

  const checkoutReady =
    supabaseUrl === "present" &&
    serviceRole === "present" &&
    mollie === "present";

  const pickupEnvReady = checkoutReady && kitchen === "present";
  const deliveryEnvReady =
    pickupEnvReady && quoteSecret === "present" && maps === "present";

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishable,
    SUPABASE_SERVICE_ROLE_KEY: serviceRole,
    KITCHEN_SECRET: kitchen,
    MOLLIE_API_KEY: mollie,
    RESEND_API_KEY: resend,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    DELIVERY_QUOTE_SECRET: quoteSecret,
    GOOGLE_MAPS_API_KEY: maps,
    ORDER_STATUS_TOKEN_SECRET: tokenSecret === "missing" ? "n/a" : tokenSecret,
    checkoutReady,
    pickupEnvReady,
    deliveryEnvReady,
  };
}
