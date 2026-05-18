import { model, Schema } from "mongoose";
import { ECategoryType, type ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(ECategoryType), required: true },
    icon: { type: String, default: "" },
    color: { type: String, default: "#000000" },
    isDefault: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

categorySchema.index({ userId: 1, type: 1, name: 1 }, { unique: true });

export const Category = model<ICategory>("Category", categorySchema);