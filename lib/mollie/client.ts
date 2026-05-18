import createMollieClient, { type MollieClient } from "@mollie/api-client";
import { isMollieConfigured } from "@/lib/supabase/env";

let client: MollieClient | null = null;

export function getMollieClient(): MollieClient {
  if (!isMollieConfigured()) {
    throw new Error("MOLLIE_API_KEY is not set");
  }
  if (!client) {
    client = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
  }
  return client;
}
