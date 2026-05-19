import { User } from "./user.model";
import AppError from "../../errorHelpers/AppError";
import { statusCode } from "../../utils/statusCode";
import type { IAuthProvider, IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import { envVar } from "../../config/env.config";
import { generateToken } from "../../utils/jwt";
import { sendEMail } from "../../utils/sendEMail";

import mongoose from "mongoose";

const registerUser = async (payload: Partial<IUser>) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await User.findOne(
      {
        $or: [{ email: payload.email }, { phone: payload.phone }],
      },
      null,
      { session },
    );

    if (existingUser) {
      throw new AppError(statusCode.BAD_REQUEST, "Email or Phone number is already registered.");
    }

    const hashPass = await bcrypt.hash(payload.password as string, Number(envVar.BCRYPT_SALT_ROUND));

    payload.password = hashPass;
    payload.auths = [
      {
        provider: "credential",
        providerId: payload.email as string,
      },
    ];

    const createdUsers = await User.create([payload], { session });

    const createUser = createdUsers[0];

    const verificationToken = generateToken({ uid: createUser!._id.toString() }, envVar.JWT_ACCESS_SECRET, "1d");

    const verificationLink = `${envVar.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEMail({
      to: createUser!.email as string,
      subject: "Welcome to Finance Manager — Verify Your Email",
      templateName: "emailVerification",
      templateData: {
        appName: "Finance Manager",
        name: createUser!.fullName,
        verificationLink,
        expiryTime: "24 hour",
      },
    });

    await session.commitTransaction();

    const { password, ...user } = createUser!.toObject();

    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllUser = async () => {
  const users = await User.find({ isDeleted: false }).select("-password");
  return users;
};

const getMe = async (id: string) => {
  const user = await User.findOne({ _id: id, isDeleted: false }).select("-password");
  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found.");
  }
  return user;
};

const getSingleUser = async (id: string) => {
  const user = await User.findOne({ _id: id, isDeleted: false }).select("-password");
  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found.");
  }
  return user;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findOneAndUpdate({ _id: id, isDeleted: false }, payload, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found.");
  }

  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true }).select("-password");

  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found.");
  }

  return user;
};

export const UserServices = {
  registerUser,
  getAllUser,
  getMe,
  getSingleUser,
  updateUser,
  deleteUser,
};
