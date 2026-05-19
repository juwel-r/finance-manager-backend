import { model, Schema } from "mongoose";
import type { ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

categorySchema.index({ userId: 1, type: 1, name: 1 }, { unique: true });

export const Category = model<ICategory>("Category", categorySchema);