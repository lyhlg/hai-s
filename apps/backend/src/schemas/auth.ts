import { z } from "zod";

export const adminLoginSchema = z.object({
  storeId: z.number().int().positive(),
  username: z.string().min(1).max(50),
  password: z.string().min(1),
});

export const tableLoginSchema = z.object({
  storeId: z.number().int().positive(),
  tableNumber: z.string().min(1),
  password: z.string().min(1),
});
