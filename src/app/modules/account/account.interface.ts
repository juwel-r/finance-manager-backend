import type { Types } from "mongoose";

export enum EAccountType {
  cash = "cash",
  bank = "bank",
  mfs = "mfs",
  card = "card",
  other = "other",
}

export interface IAccount {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: EAccountType;
  currency: string;
  openingBalance: number;
  currentBalance: number;
  isArchived: boolean;
}