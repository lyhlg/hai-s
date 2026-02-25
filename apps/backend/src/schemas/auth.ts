import { z } from "zod";

export const adminLoginSchema = z.object({
  storeId: z.string().min(1),
  username: z.string().min(1).max(50),
  password: z.string().min(1),
});

export const tableLoginSchema = z.object({
  storeId: z.string().min(1),
  tableNumber: z.number().int().positive(),
  password: z.string().min(1),
});
