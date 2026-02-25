import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(z.object({
    menuItemId: z.string().min(1),
    quantity: z.number().int().positive(),
  })).min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["confirmed", "preparing", "ready", "served"]),
});
