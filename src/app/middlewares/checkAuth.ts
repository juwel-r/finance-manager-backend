import type { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env.config";
import AppError from "../errorHelpers/AppError";
import { ERole } from "../modules/user/user.interface";
import type { JwtPayload } from "jsonwebtoken";
import { statusCode } from "../utils/statusCode";
import { verifyToken } from "../utils/jwt";
import { checkUserStatus } from "../utils/checkUserStatus";

export const checkAuth =
  (...authRoles: ERole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(statusCode.UNAUTHORIZED, "No access token found.");
      }

      const verifiedToken = verifyToken(accessToken, envVar.JWT_ACCESS_SECRET) as JwtPayload;
      if (!verifiedToken) {
        throw new AppError(statusCode.UNAUTHORIZED, "Invalid access token.");
      }

      await checkUserStatus("","",verifiedToken.uid);

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(statusCode.UNAUTHORIZED, "You are not permitted for this route.");
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
