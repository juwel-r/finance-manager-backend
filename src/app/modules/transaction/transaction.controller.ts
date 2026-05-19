import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { statusCode } from "../../utils/statusCode";
import { TransactionServices } from "./transaction.service";
import { sendRes } from "../../utils/sendResponse";
import type { ETransactionType } from "./transaction.interface";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.createTransaction({
    ...req.body,
    userId: req.user!.uid,
  });

  sendRes(res, {
    statusCode: statusCode.CREATED,
    success: true,
    message: "Transaction created successfully.",
    data: result,
  });
});

const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.getMyTransactions(req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Transactions fetched successfully.",
    data: result,
  });
});

const getSingleTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransactionServices.getSingleTransaction(id as string, req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Transaction fetched successfully.",
    data: result,
  });
});

const getTransactionsByType = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.query;
  const userId = req.user.uid;
  const result = await TransactionServices.getTransactionsByType(userId as string, type as ETransactionType);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Transaction fetched successfully.",
    data: result,
  });
});

const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await TransactionServices.updateTransaction(id as string, req.user!.uid, payload);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Transaction updated successfully.",
    data: result,
  });
});

const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransactionServices.deleteTransaction(id as string, req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Transaction deleted successfully.",
    data: result,
  });
});

export const TransactionController = {
  createTransaction,
  getMyTransactions,
  getSingleTransaction,
  getTransactionsByType,
  updateTransaction,
  deleteTransaction,
};
