import { model, Schema } from "mongoose";
import { EAccountType, type IAccount } from "./account.interface";

const accountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(EAccountType), default: EAccountType.cash },
    currency: { type: String, default: "BDT", trim: true },
    openingBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

accountSchema.index({ userId: 1, name: 1 }, { unique: true });
accountSchema.index({ userId: 1, type: 1 });

export const Account = model<IAccount>("Account", accountSchema);
