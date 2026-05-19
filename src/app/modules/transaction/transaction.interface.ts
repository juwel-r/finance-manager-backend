import type { Types } from "mongoose";

export enum ETransactionType {
  income = "income",
  expense = "expense",
  transfer = "transfer",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  type: ETransactionType;
  amount: number;
  sourceAccountId?: Types.ObjectId;
  destinationAccountId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  incomeSource?: string;
  note?: string;
  transactionDate: Date;
}
