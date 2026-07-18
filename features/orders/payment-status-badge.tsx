import { cn } from "@/lib/utils";
import { paymentStatusLabel } from "@/lib/orders/labels";
import type { PaymentStatus } from "@/lib/orders/types";

const styles: Record<string, string> = {
  paid: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  pending: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  unpaid: "border-red-500/40 bg-red-500/15 text-red-300",
  failed: "border-red-500/40 bg-red-500/15 text-red-300",
  canceled: "border-red-500/40 bg-red-500/15 text-red-300",
  expired: "border-red-500/40 bg-red-500/15 text-red-300",
  refunded: "border-violet-500/40 bg-violet-500/15 text-violet-300",
};

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        styles[status] ?? styles.pending,
        className,
      )}
    >
      {paymentStatusLabel(status)}
    </span>
  );
}
