import { model, Schema } from "mongoose";
import { ERole, type IAuthProvider, type IUser } from "./user.interface";

const AuthProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  },
);

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, select: false },
    role: { type: String, enum: Object.values(ERole), default: ERole.user },
    avatar: { type: String, default: "" },
    auths: { type: [AuthProviderSchema], default: [] },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// userSchema.index({ email: 1 });
// userSchema.index({ phone: 1 });

export const User = model<IUser>("User", userSchema);