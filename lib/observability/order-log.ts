/**
 * Structured order-path logging — never log PII, tokens, or secrets.
 */

export type OrderLogCode =
  | "ORDER_CREATE_STARTED"
  | "ORDER_VALIDATION_REJECTED"
  | "ORDER_CREATE_OK"
  | "ORDER_CREATE_FAILED"
  | "PAYMENT_CREATE_STARTED"
  | "PAYMENT_CREATE_OK"
  | "PAYMENT_CREATE_FAILED"
  | "WEBHOOK_RECEIVED"
  | "WEBHOOK_AMOUNT_MISMATCH"
  | "WEBHOOK_PAID_VERIFIED"
  | "WEBHOOK_SKIPPED"
  | "ORDER_CONFIRMED"
  | "EMAIL_SENT"
  | "EMAIL_FAILED"
  | "EMAIL_SKIPPED_IDEMPOTENT"
  | "KITCHEN_STATUS_CHANGE"
  | "UNEXPECTED_ERROR";

export function orderLog(
  code: OrderLogCode,
  fields: Record<string, string | number | boolean | null | undefined> = {},
): void {
  const correlationId =
    typeof fields.correlationId === "string" && fields.correlationId
      ? fields.correlationId
      : undefined;
  const safe: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    // Hard block common PII / secret keys
    if (/email|phone|name|address|token|secret|key|password|note/i.test(k)) continue;
    safe[k] = v;
  }
  const line = {
    ts: new Date().toISOString(),
    code,
    ...(correlationId ? { correlationId } : {}),
    ...safe,
  };
  if (code === "UNEXPECTED_ERROR" || code.endsWith("_FAILED") || code.includes("MISMATCH")) {
    console.error("[order]", line);
  } else {
    console.info("[order]", line);
  }
}
