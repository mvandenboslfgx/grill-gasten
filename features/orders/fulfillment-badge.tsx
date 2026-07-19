import { cn } from "@/lib/utils";
import { fulfillmentLabel } from "@/lib/orders/labels";
import type { FulfillmentMethod } from "@/lib/orders/types";

/** Prominent AFHALEN / BEZORGEN for kitchen + print. */
export function FulfillmentBadge({
  method,
  className,
  size = "default",
}: {
  method: FulfillmentMethod | string | null | undefined;
  className?: string;
  size?: "default" | "hero";
}) {
  const delivery = method === "delivery";
  const label = delivery ? "BEZORGEN" : "AFHALEN";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-[0.12em]",
        size === "hero"
          ? "px-4 py-2 text-sm md:text-base print:rounded-none print:border-2 print:border-black print:px-3 print:py-1 print:text-xl print:font-black print:tracking-widest"
          : "px-2.5 py-0.5 text-[10px]",
        delivery
          ? "border-primary/40 bg-primary/15 text-primary print:bg-transparent print:text-black"
          : "border-sky-500/40 bg-sky-500/15 text-sky-300 print:bg-transparent print:text-black",
        className,
      )}
      aria-label={fulfillmentLabel(method)}
    >
      {label}
    </span>
  );
}
