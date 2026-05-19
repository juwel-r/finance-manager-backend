import z from "zod";
import { ETransactionType } from "./transaction.interface";

const baseTransactionZod = z.object({
  type: z.enum([ETransactionType.income, ETransactionType.expense, ETransactionType.transfer]),

  amount: z.number({ message: "Amount must be number." }).positive({
    message: "Amount must be greater than 0.",
  }),

  sourceAccountId: z.string().optional(),
  destinationAccountId: z.string().optional(),
  categoryId: z.string().optional(),
  incomeSource: z.string().optional(),
  note: z.string().optional(),
  transactionDate: z.coerce.date().optional(),
});

export const createTransactionZod = baseTransactionZod.superRefine((data, ctx) => {
  if (data.type === ETransactionType.expense) {
    if (!data.sourceAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sourceAccountId"],
        message: "Source is required to add expense.",
      });
    }
    if (!data.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryId"],
        message: "Category is required to add expense.",
      });
    }
  }

  if (data.type === ETransactionType.income) {
    if (!data.destinationAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destinationAccountId"],
        message: "Destination is required to add income.",
      });
    }
    if (!data.incomeSource) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["incomeSource"],
        message: "Income source is required to add income.",
      });
    }
  }

  if (data.type === ETransactionType.transfer) {
    if (!data.sourceAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sourceAccountId"],
        message: "sourceAccountId is required for transfer.",
      });
    }
    if (!data.destinationAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destinationAccountId"],
        message: "destinationAccountId is required for transfer.",
      });
    }
  }
});

export const updateTransactionZod = z.object({
  type: z.enum([ETransactionType.income, ETransactionType.expense, ETransactionType.transfer]).optional(),
  amount: z.number({ message: "Amount must be number." }).positive().optional(),
  sourceAccountId: z.string().optional(),
  destinationAccountId: z.string().optional(),
  categoryId: z.string().optional(),
  incomeSource: z.string().optional(),
  note: z.string().optional(),
  transactionDate: z.coerce.date().optional(),
});
