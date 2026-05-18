import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { statusCode } from "../../utils/statusCode";
import { UserServices } from "./user.service";
import { sendRes } from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserServices.registerUser(payload);

  sendRes(res, {
    statusCode: statusCode.CREATED,
    success: true,
    message: "User registered successfully.",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUser();

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Users fetched successfully.",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getMe(req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Profile fetched successfully.",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUser(id as string);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User fetched successfully.",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserServices.updateUser(id as string, payload);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User updated successfully.",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.deleteUser(id as string);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User deleted successfully.",
    data: result,
  });
});

export const UserController = {
  registerUser,
  getAllUser,
  getMe,
  getSingleUser,
  updateUser,
  deleteUser,
};