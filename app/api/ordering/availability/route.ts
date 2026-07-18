import { NextResponse } from "next/server";
import {
  getAvailableDates,
  getAvailableSlotsForDate,
  isOrderingOpen,
} from "@/lib/ordering/availability";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import { isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");

  const infraReady = isSupabaseConfigured() && isMollieConfigured();
  const open = infraReady && orderingConfig.orderingEnabled && isOrderingOpen();

  if (!date) {
    return NextResponse.json({
      ok: true,
      orderingEnabled: open,
      reason: !infraReady
        ? "infra"
        : !orderingConfig.orderingEnabled
          ? "config"
          : open
            ? null
            : "no_slots",
      dates: open ? getAvailableDates() : [],
      slotCapacity: orderingConfig.slotCapacity,
    });
  }

  if (!open) {
    return NextResponse.json({ ok: true, orderingEnabled: false, slots: [] });
  }

  return NextResponse.json({
    ok: true,
    orderingEnabled: true,
    date,
    slots: getAvailableSlotsForDate(date),
  });
}
