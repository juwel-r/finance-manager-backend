import type { Types } from "mongoose";

export enum EAccountType {
  cash = "cash",
  bank = "bank",
  mfs = "mfs",
  card = "card",
  electric = "electric",
  other = "other",
}

export interface IAccount {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: EAccountType;
  openingBalance: number;
  currentBalance: number;
  isArchived: boolean;
  isDefault: boolean; //Use for expense
}
