import { z } from "zod";

export const orderLineSchema = z.object({
  productId: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(20),
  optionIds: z.array(z.string().min(1).max(64)).max(10).default([]),
  note: z.string().max(200).optional(),
});

export const createOrderSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(30)
    .regex(/^[+\d\s()-]+$/, "Ongeldig telefoonnummer"),
  email: z.string().trim().email().max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  note: z.string().max(500).optional(),
  lines: z.array(orderLineSchema).min(1).max(30),
  website: z.string().max(200).optional(),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
