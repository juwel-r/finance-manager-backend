import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync"; 
import { statusCode } from "../../utils/statusCode";
import { AccountServices } from "./account.service";
import { sendRes } from "../../utils/sendResponse";

const createAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await AccountServices.createAccount({
    ...req.body,
    userId: req.user!.uid,
  });

  sendRes(res, {
    statusCode: statusCode.CREATED,
    success: true,
    message: "Account created successfully.",
    data: result,
  });
});

const getMyAccounts = catchAsync(async (req: Request, res: Response) => {
  const result = await AccountServices.getMyAccounts(req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Accounts fetched successfully.",
    data: result,
  });
});

const getSingleAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AccountServices.getSingleAccount(id as string, req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Account fetched successfully.",
    data: result,
  });
});

const updateAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AccountServices.updateAccount(
    id as string,
    req.user!.uid,
    req.body,
  );

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Account updated successfully.",
    data: result,
  });
});

const archiveAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AccountServices.archiveAccount(id as string, req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Account archived successfully.",
    data: result,
  });
});

export const AccountController = {
  createAccount,
  getMyAccounts,
  getSingleAccount,
  updateAccount,
  archiveAccount,
};