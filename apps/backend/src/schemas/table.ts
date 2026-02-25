import { z } from "zod";

export const createTableSchema = z.object({
  tableNumber: z.number().int().positive(),
  password: z.string().min(1),
});
