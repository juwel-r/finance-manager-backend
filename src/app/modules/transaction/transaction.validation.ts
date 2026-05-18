import z from "zod";
import { ETransactionStatus, ETransactionType } from "./transaction.interface";

const baseTransactionZod = z.object({
  type: z.enum([
    ETransactionType.income,
    ETransactionType.expense,
    ETransactionType.transfer,
  ]),

  amount: z.number({ message: "Amount must be number." }).positive({
    message: "Amount must be greater than 0.",
  }),

  fromAccountId: z.string().optional(),
  toAccountId: z.string().optional(),
  categoryId: z.string().optional(),

  note: z.string().optional(),
  transactionDate: z.coerce.date().optional(),

  status: z.enum([
    ETransactionStatus.posted,
    ETransactionStatus.pending,
    ETransactionStatus.cancelled,
  ]).optional(),
});

export const createTransactionZod = baseTransactionZod.superRefine((data, ctx) => {
  if (data.type === ETransactionType.expense) {
    if (!data.fromAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fromAccountId"],
        message: "fromAccountId is required for expense.",
      });
    }
    if (!data.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryId"],
        message: "categoryId is required for expense.",
      });
    }
  }

  if (data.type === ETransactionType.income) {
    if (!data.toAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toAccountId"],
        message: "toAccountId is required for income.",
      });
    }
    if (!data.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryId"],
        message: "categoryId is required for income.",
      });
    }
  }

  if (data.type === ETransactionType.transfer) {
    if (!data.fromAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fromAccountId"],
        message: "fromAccountId is required for transfer.",
      });
    }
    if (!data.toAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toAccountId"],
        message: "toAccountId is required for transfer.",
      });
    }
    if (data.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryId"],
        message: "categoryId should not be used for transfer.",
      });
    }
  }
});

export const updateTransactionZod = z.object({
  type: z.enum([
    ETransactionType.income,
    ETransactionType.expense,
    ETransactionType.transfer,
  ]).optional(),

  amount: z.number({ message: "Amount must be number." }).positive().optional(),

  fromAccountId: z.string().optional(),
  toAccountId: z.string().optional(),
  categoryId: z.string().optional(),

  note: z.string().optional(),
  transactionDate: z.coerce.date().optional(),

  status: z.enum([
    ETransactionStatus.posted,
    ETransactionStatus.pending,
    ETransactionStatus.cancelled,
  ]).optional(),
});