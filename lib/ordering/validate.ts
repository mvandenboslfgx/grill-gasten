import { z } from "zod";

export const orderLineSchema = z.object({
  productId: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(30),
  optionIds: z.array(z.string().min(1).max(64)).max(10).default([]),
  sauceChoice: z.string().max(30).optional(),
  note: z.string().max(200).optional(),
});

export const createOrderSchema = z
  .object({
    method: z.enum(["pickup", "delivery"]),
    name: z.string().trim().min(2).max(100),
    phone: z
      .string()
      .trim()
      .min(8)
      .max(30)
      .regex(/^[+\d\s()-]+$/, "Ongeldig telefoonnummer"),
    email: z.string().trim().email().max(120),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** pickup: HH:mm — delivery: window id like 17:00-17:30 */
    time: z.string().min(4).max(20),
    note: z.string().max(500).optional(),
    deliveryInstructions: z.string().max(150).optional(),
    quoteId: z.string().max(4000).optional(),
    postcode: z.string().max(10).optional(),
    houseNumber: z.string().max(10).optional(),
    addition: z.string().max(12).optional(),
    lines: z.array(orderLineSchema).min(1).max(30),
    website: z.string().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === "delivery") {
      if (!data.quoteId) {
        ctx.addIssue({ code: "custom", message: "Controleer eerst je bezorgadres.", path: ["quoteId"] });
      }
      if (!data.postcode || !data.houseNumber) {
        ctx.addIssue({ code: "custom", message: "Vul postcode en huisnummer in.", path: ["postcode"] });
      }
    }
  });

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
