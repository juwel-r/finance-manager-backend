import type { Request, Response } from "express";
import statusCode from "http-status";

export const routeNotFound = (req: Request, res: Response) => {
  res.status(statusCode.NOT_FOUND).json({
    success: false,
    message: "Route not found.",
  });
};
