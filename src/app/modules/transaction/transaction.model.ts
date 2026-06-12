import { model, Schema } from "mongoose";
import { ETransactionType, type ITransaction } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: Object.values(ETransactionType), required: true },
    amount: { type: Number, required: true, min: 1 },
    sourceAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    destinationAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    note: { type: String, default: "", trim: true },
    incomeSource: { type: String },
    transactionDate: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, type: 1 });

transactionSchema.pre("validate", function () {
  if (this.type === ETransactionType.expense) {
    if (!this.sourceAccountId) throw new Error("Source is required to add expense.");
    if (!this.categoryId) throw new Error("Category is required to add expense.");
  }

  if (this.type === ETransactionType.income) {
    if (!this.destinationAccountId) throw new Error("Destination is required to add income.");
    if (!this.incomeSource) throw new Error("Income source is required to add income.");
  }

  if (this.type === ETransactionType.transfer) {
    if (!this.sourceAccountId) throw new Error("Source is required for transfer.");
    if (!this.destinationAccountId) throw new Error("Destination is required for transfer.");
  }
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
