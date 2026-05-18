import { User } from "./user.model";
import AppError from "../../errorHelpers/AppError";
import { statusCode } from "../../utils/statusCode";
import type { IUser } from "./user.interface";

const registerUser = async (payload: Partial<IUser>) => {
  const existingUser = await User.findOne({
    $or: [{ email: payload.email }, { phone: payload.phone }],
  });

  if (existingUser) {
    throw new AppError(statusCode.BAD_REQUEST, "User already exists.");
  }

  const user = await User.create(payload);
  return user;
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
  const user = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found.");
  }

  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  ).select("-password");

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