import { z } from "zod";

export const createTableSchema = z.object({
  tableNumber: z.string().min(1),
  password: z.string().min(1),
  capacity: z.number().int().positive().optional(),
});
