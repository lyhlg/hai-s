import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().int().positive(),
  category: z.string().min(1).max(50),
  imageUrl: z.string().max(500).optional(),
  isPopular: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateMenuItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  price: z.number().int().positive().optional(),
  category: z.string().min(1).max(50).optional(),
  imageUrl: z.string().max(500).nullable().optional(),
  isAvailable: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});
