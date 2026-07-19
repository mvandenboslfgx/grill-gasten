import { getMollieClient } from "@/lib/mollie/client";
import { site } from "@/lib/site";

export async function createMollieCheckout(params: {
  orderId: string;
  orderNumber: string;
  totalCents: number;
  description: string;
  customerEmail?: string;
  accessToken: string;
}): Promise<{ paymentId: string; checkoutUrl: string } | null> {
  const mollie = getMollieClient();
  const amount = (params.totalCents / 100).toFixed(2);
  const baseUrl = site.url.replace(/\/$/, "");
  const statusPath = `/bestellen/status/${encodeURIComponent(params.orderNumber)}?t=${encodeURIComponent(params.accessToken)}`;

  const payment = await mollie.payments.create({
    amount: { currency: "EUR", value: amount },
    description: params.description,
    redirectUrl: `${baseUrl}${statusPath}`,
    webhookUrl: `${baseUrl}/api/mollie/webhook`,
    metadata: {
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      // Needed to build status links in post-payment e-mail (hash only in DB).
      accessToken: params.accessToken,
    },
  });

  const checkoutUrl = payment.getCheckoutUrl();
  if (!checkoutUrl || !payment.id) return null;

  return { paymentId: payment.id, checkoutUrl };
}
