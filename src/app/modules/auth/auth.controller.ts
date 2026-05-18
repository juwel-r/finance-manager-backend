/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express";;
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { setCookieAuth } from "../../utils/setCookies";
import { sendRes } from "../../utils/sendResponse";
import { statusCode } from "../../utils/statusCode";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AuthServices.credentialLogin(req.body);

  setCookieAuth(res, result);

  sendRes(res, {
    statusCode: statusCode.CREATED,
    success: true,
    message: "Login Successful.",
    data: result,
  });
});

//
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendRes(res, {
    success: true,
    statusCode: statusCode.OK,
    message: "Successfully Logged out",
    data: null,
  });
});

//
const newAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new AppError(statusCode.FORBIDDEN, "No refresh token found.");
  }
  const result = await AuthServices.newAccessToken(refreshToken);
  setCookieAuth(res, result);

  sendRes(res, {
    statusCode: statusCode.CREATED,
    success: true,
    message: "New access token created.",
    data: result,
  });
});

//
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword, oldPassword } = req.body;
  const decodedToken = req.user;
  const updatePassword = await AuthServices.changePassword(newPassword, oldPassword, decodedToken as JwtPayload);

  sendRes(res, {
    success: true,
    statusCode: statusCode.OK,
    message: updatePassword,
    data: null,
  });
});

//
const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  const decodedToken = req.user as JwtPayload;
  await AuthServices.setPassword(decodedToken.uid, password);

  sendRes(res, {
    success: true,
    statusCode: statusCode.OK,
    message: "Password set successfully.",
    data: null,
  });
});

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthServices.forgotPassword(email);

    sendRes(res, {
      success: true,
      statusCode: statusCode.OK,
      message: "Password recovery email sent successfully.",
      data: null,
    });
  }
);

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user;
  const password = req.body.password;

  await AuthServices.resetPassword(decodedToken.uid, password);

  sendRes(res, {
    success: true,
    statusCode: statusCode.OK,
    message: "Password reset successfully.",
    data: null,
  });
});

export const AuthController = {
  credentialLogin,
  newAccessToken,
  logout,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword
};
