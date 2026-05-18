import type { Types } from "mongoose";

export enum ETransactionType {
  income = "income",
  expense = "expense",
  transfer = "transfer",
}

export enum ETransactionStatus {
  posted = "posted",
  pending = "pending",
  cancelled = "cancelled",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  type: ETransactionType;
  amount: number;
  fromAccountId?: Types.ObjectId;
  toAccountId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  note?: string;
  transactionDate: Date;
  status: ETransactionStatus;
}