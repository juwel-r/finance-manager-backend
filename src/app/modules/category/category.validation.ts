import z from "zod";

export const createCategoryZod = z.object({
  name: z
    .string({ message: "Category name must be string." })
    .min(2, { message: "Category name must be at least 2 characters." })
    .max(50, { message: "Category name can't exceed 50 characters." }),
  isDefault: z.boolean().optional(),
  forceDefault: z.boolean().optional(),
});

export const updateCategoryZod = z.object({
  name: z
    .string({ message: "Category name must be string." })
    .min(2, { message: "Category name must be at least 2 characters." })
    .max(50, { message: "Category name can't exceed 50 characters." })
    .optional(),
  isDefault: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  forceDefault: z.boolean().optional(),
});
