import type { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env.config";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let statusCode = 500;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message,
    err,
    stack: envVar.NODE_ENV === "development" ? err.stack : null,
  });
};
