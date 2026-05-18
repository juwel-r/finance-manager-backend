import { model, Schema } from "mongoose";
import { ETransactionStatus, ETransactionType, type ITransaction } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: Object.values(ETransactionType), required: true },
    amount: { type: Number, required: true, min: 1 },
    fromAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    toAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    note: { type: String, default: "", trim: true },
    transactionDate: { type: Date, default: Date.now },
    status: { type: String, enum: Object.values(ETransactionStatus), default: ETransactionStatus.posted },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, type: 1 });

transactionSchema.pre("validate", function (next:any) {
  if (this.type === ETransactionType.expense) {
    if (!this.fromAccountId) return next(new Error("fromAccountId is required for expense."));
    if (!this.categoryId) return next(new Error("categoryId is required for expense."));
  }

  if (this.type === ETransactionType.income) {
    if (!this.toAccountId) return next(new Error("toAccountId is required for income."));
    if (!this.categoryId) return next(new Error("categoryId is required for income."));
  }

  if (this.type === ETransactionType.transfer) {
    if (!this.fromAccountId || !this.toAccountId) {
      return next(new Error("fromAccountId and toAccountId are required for transfer."));
    }
  }

  next();
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema);