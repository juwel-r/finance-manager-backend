import type { Types } from "mongoose";

export enum ERole {
  admin = "admin",
  user = "user",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  fullName: string;
  email?: string;
  phone?: string;
  password?: string;
  role: ERole;
  avatar?: string;
  auths: IAuthProvider[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}