import { cn } from "@/lib/utils";
import { fulfillmentLabel } from "@/lib/orders/labels";
import type { FulfillmentMethod } from "@/lib/orders/types";

export function FulfillmentBadge({
  method,
  className,
}: {
  method: FulfillmentMethod | string | null | undefined;
  className?: string;
}) {
  const delivery = method === "delivery";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        delivery
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-sky-500/40 bg-sky-500/15 text-sky-300",
        className,
      )}
    >
      {fulfillmentLabel(method)}
    </span>
  );
}
