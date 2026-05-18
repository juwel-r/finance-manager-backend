import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { statusCode } from "../../utils/statusCode";
import { ReportServices } from "./report.service";
import { sendRes } from "../../utils/sendResponse";

const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.uid;
  const result = await ReportServices.getDashboard(userId);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Dashboard report fetched successfully.",
    data: result,
  });
});

const getMonthlyTrend = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.uid;
  const year = Number(req.query.year) || new Date().getFullYear();
  const result = await ReportServices.getMonthlyTrend(userId, year);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Monthly trend fetched successfully.",
    data: result,
  });
});

const getCategorySummary = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.uid;
  const result = await ReportServices.getCategorySummary(userId);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Category summary fetched successfully.",
    data: result,
  });
});

const getAccountSummary = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.uid;
  const result = await ReportServices.getAccountSummary(userId);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Account summary fetched successfully.",
    data: result,
  });
});

export const ReportController = {
  getDashboard,
  getMonthlyTrend,
  getCategorySummary,
  getAccountSummary,
};