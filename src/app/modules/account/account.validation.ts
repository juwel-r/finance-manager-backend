import z from "zod";
import { EAccountType } from "./account.interface";

export const createAccountZod = z.object({
  name: z
    .string({ message: "Account name must be string." })
    .min(2, { message: "Account name must be at least 2 characters." })
    .max(50, { message: "Account name can't exceed 50 characters." }),

  type: z.enum([
    EAccountType.cash,
    EAccountType.bank,
    EAccountType.mfs,
    EAccountType.card,
    EAccountType.other,
  ]).optional(),

  currency: z
    .string({ message: "Currency must be string." })
    .min(3, { message: "Currency must be at least 3 characters." })
    .max(10, { message: "Currency can't exceed 10 characters." })
    .optional(),

  openingBalance: z.number({ message: "Opening balance must be number." }).min(0).optional(),
  currentBalance: z.number({ message: "Current balance must be number." }).min(0).optional(),
});

export const updateAccountZod = z.object({
  name: z
    .string({ message: "Account name must be string." })
    .min(2, { message: "Account name must be at least 2 characters." })
    .max(50, { message: "Account name can't exceed 50 characters." })
    .optional(),

  type: z.enum([
    EAccountType.cash,
    EAccountType.bank,
    EAccountType.mfs,
    EAccountType.card,
    EAccountType.other,
  ]).optional(),

  currency: z
    .string({ message: "Currency must be string." })
    .min(3, { message: "Currency must be at least 3 characters." })
    .max(10, { message: "Currency can't exceed 10 characters." })
    .optional(),

  openingBalance: z.number({ message: "Opening balance must be number." }).min(0).optional(),
  currentBalance: z.number({ message: "Current balance must be number." }).min(0).optional(),
  isArchived: z.boolean().optional(),
});