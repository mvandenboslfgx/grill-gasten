import { cn } from "@/lib/utils";
import { orderStatusLabel } from "@/lib/orders/labels";
import type { FulfillmentMethod, OrderStatus } from "@/lib/orders/types";

export function OrderStatusBadge({
  status,
  method,
  className,
}: {
  status: OrderStatus | string;
  method?: FulfillmentMethod | string | null;
  className?: string;
}) {
  const tone =
    status === "cancelled"
      ? "border-white/20 bg-white/5 text-muted-foreground"
      : status === "preparing" || status === "confirmed"
        ? "border-primary/40 bg-primary/15 text-primary"
        : status === "ready" || status === "out_for_delivery"
          ? "border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37]"
          : status === "delivered" || status === "picked_up"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            : "border-amber-500/40 bg-amber-500/10 text-amber-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        tone,
        className,
      )}
    >
      {orderStatusLabel(status, method)}
    </span>
  );
}
