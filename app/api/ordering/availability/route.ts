import { NextResponse } from "next/server";
import {
  getAvailableDates,
  getAvailableDeliveryWindows,
  getAvailablePickupSlots,
  isOrderingOpen,
} from "@/lib/ordering/availability";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import { isDeliveryRoutingConfigured, isQuoteSecretConfigured } from "@/lib/delivery/config";
import { isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  const method = url.searchParams.get("method") === "delivery" ? "delivery" : "pickup";

  const infraReady = isSupabaseConfigured() && isMollieConfigured();
  const fulfillmentReady =
    orderingConfig.pickupEnabled || orderingConfig.deliveryEnabled;
  const open =
    infraReady &&
    orderingConfig.orderingEnabled &&
    orderingConfig.openWeekdays.length > 0 &&
    fulfillmentReady &&
    isOrderingOpen();
  const deliveryRoutingConfigured =
    orderingConfig.deliveryEnabled &&
    isDeliveryRoutingConfigured() &&
    isQuoteSecretConfigured();

  if (!date) {
    return NextResponse.json({
      ok: true,
      orderingEnabled: open,
      deliveryRoutingConfigured,
      pickupEnabled: orderingConfig.pickupEnabled,
      deliveryEnabled: orderingConfig.deliveryEnabled && deliveryRoutingConfigured,
      reason: !infraReady
        ? "infra"
        : !orderingConfig.orderingEnabled
          ? "config"
          : !fulfillmentReady
            ? "fulfillment"
            : open
              ? null
              : "no_slots",
      dates: open ? getAvailableDates() : [],
      pickupCapacity: orderingConfig.pickupSlotCapacity,
      deliveryCapacity: orderingConfig.deliveryWindowCapacity,
    });
  }

  if (!open) {
    return NextResponse.json({ ok: true, orderingEnabled: false, slots: [], windows: [] });
  }

  if (method === "delivery") {
    return NextResponse.json({
      ok: true,
      orderingEnabled: true,
      date,
      windows: getAvailableDeliveryWindows(date),
    });
  }

  return NextResponse.json({
    ok: true,
    orderingEnabled: true,
    date,
    slots: getAvailablePickupSlots(date),
  });
}
