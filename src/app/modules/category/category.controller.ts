import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { statusCode } from "../../utils/statusCode";
import { CategoryServices } from "./category.service";
import { sendRes } from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategory({
    ...req.body,
    userId: req.user!.uid,
  });

  sendRes(res, {
    statusCode: statusCode.CREATED,
    success: true,
    message: "Category created successfully.",
    data: result,
  });
});

const getMyCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.getMyCategories(req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Categories fetched successfully.",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CategoryServices.getSingleCategory(id as string, req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Category fetched successfully.",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CategoryServices.updateCategory(
    id as string,
    req.user!.uid,
    req.body,
  );

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Category updated successfully.",
    data: result,
  });
});

const archiveCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CategoryServices.archiveCategory(id as string, req.user!.uid);

  sendRes(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Category archived successfully.",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getMyCategories,
  getSingleCategory,
  updateCategory,
  archiveCategory,
};