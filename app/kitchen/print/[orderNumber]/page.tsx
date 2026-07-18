import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderDetail } from "@/features/orders/order-detail";
import { getOrderByNumber } from "@/lib/orders/create-order";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Props = { params: Promise<{ orderNumber: string }> };

export const metadata: Metadata = {
  title: "Printbon",
  robots: { index: false, follow: false },
};

export default async function KitchenPrintPage({ params }: Props) {
  if (!isSupabaseConfigured()) notFound();
  const { orderNumber } = await params;
  const order = await getOrderByNumber(decodeURIComponent(orderNumber));
  if (!order) notFound();

  return (
    <div className="kitchen-print mx-auto max-w-md bg-white p-6 text-black">
      <style>{`
        @media print {
          nav, header, footer, .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .kitchen-print { box-shadow: none !important; max-width: 100% !important; }
        }
      `}</style>
      <OrderDetail order={order} mode="print" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.addEventListener('load',()=>setTimeout(()=>window.print(),300));`,
        }}
      />
    </div>
  );
}
