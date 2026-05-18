import { getMollieClient } from "@/lib/mollie/client";
import { site } from "@/lib/site";

export async function createMollieCheckout(params: {
  orderId: string;
  orderNumber: string;
  totalCents: number;
  description: string;
  customerEmail?: string;
}): Promise<{ paymentId: string; checkoutUrl: string } | null> {
  const mollie = getMollieClient();
  const amount = (params.totalCents / 100).toFixed(2);
  const baseUrl = site.url.replace(/\/$/, "");

  const payment = await mollie.payments.create({
    amount: { currency: "EUR", value: amount },
    description: params.description,
    redirectUrl: `${baseUrl}/bestellen?paid=1&order=${encodeURIComponent(params.orderNumber)}`,
    webhookUrl: `${baseUrl}/api/mollie/webhook`,
    metadata: {
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      customerEmail: params.customerEmail ?? "",
    },
  });

  const checkoutUrl = payment.getCheckoutUrl();
  if (!checkoutUrl || !payment.id) return null;

  return { paymentId: payment.id, checkoutUrl };
}
