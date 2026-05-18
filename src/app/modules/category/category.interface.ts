import type { Types } from "mongoose";

export enum ECategoryType {
  income = "income",
  expense = "expense",
}

export interface ICategory {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: ECategoryType;
  icon?: string;
  color?: string;
  isDefault: boolean;
  isArchived: boolean;
}