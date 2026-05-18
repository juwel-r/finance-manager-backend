import z from "zod";
import { ECategoryType } from "./category.interface";

export const createCategoryZod = z.object({
  name: z
    .string({ message: "Category name must be string." })
    .min(2, { message: "Category name must be at least 2 characters." })
    .max(50, { message: "Category name can't exceed 50 characters." }),

  type: z.enum([ECategoryType.income, ECategoryType.expense], {
    message: "Category type must be income or expense.",
  }),

  icon: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const updateCategoryZod = z.object({
  name: z
    .string({ message: "Category name must be string." })
    .min(2, { message: "Category name must be at least 2 characters." })
    .max(50, { message: "Category name can't exceed 50 characters." })
    .optional(),

  type: z.enum([ECategoryType.income, ECategoryType.expense], {
    message: "Category type must be income or expense.",
  }).optional(),

  icon: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});