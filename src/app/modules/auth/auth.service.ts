import bcrypt from "bcryptjs";
import type { IAuthProvider, IUser } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import { envVar } from "../../config/env.config";
import type { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { statusCode } from "../../utils/statusCode";
import { checkUserStatus } from "../../utils/checkUserStatus";
import { createUserToken } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { sendEMail } from "../../utils/sendEMail";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, phone, password } = payload;

  if (!password) {
    throw new AppError(statusCode.FORBIDDEN, "Password field can't be empty.");
  }

  let isExistUser;
  if (email) {
    isExistUser = await checkUserStatus(email);
  } else if (phone) {
    isExistUser = await checkUserStatus("", phone);
  }

  const isPassMatch = await bcrypt.compare(password as string, isExistUser?.password as string);
  if (!isPassMatch) {
    throw new AppError(statusCode.UNAUTHORIZED, "Credential not matched!");
  }
  const userTokens = createUserToken(isExistUser!);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...user } = isExistUser!.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user,
  };
};

const newAccessToken = async (refreshToken: string) => {
  const verifyRefreshToken = verifyToken(refreshToken, envVar.JWT_REFRESH_SECRET) as JwtPayload;
  const user = await checkUserStatus("", "", verifyRefreshToken.uid);

  const jwtPayload = {
    uid: user?._id,
    role: user?.role,
  };

  const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRES);

  return { accessToken };
};

const changePassword = async (newPassword: string, oldPassword: string, decodedToken: JwtPayload) => {
  const user = await checkUserStatus("", "", decodedToken.uid);

  const isOldPassMatched = await bcryptjs.compare(oldPassword, user!.password!);
  if (!isOldPassMatched) {
    throw new AppError(statusCode.UNAUTHORIZED, "Old Password does not matched!");
  }

  const newHashedPass = await bcryptjs.hash(newPassword, Number(envVar.BCRYPT_SALT_ROUND));

  user!.password = newHashedPass;
  user!.save();
  return "Password changed successfully.";
};

const setPassword = async (userId: string, password: string) => {
  const user = await checkUserStatus("", "", userId);

  if (user!.password) {
    throw new AppError(statusCode.BAD_REQUEST, "You have already set your password.");
  }

  const hashedPassword = await bcryptjs.hash(password, Number(envVar.BCRYPT_SALT_ROUND));

  const credential: IAuthProvider = {
    provider: "credential",
    providerId: "",
  };
  if (user?.email) {
    credential.providerId = user.email;
  } else {
    credential.providerId = user!.phone!;
  }

  const authProvider: IAuthProvider[] = [...user!.auths, credential];

  user!.auths = authProvider;
  user!.password = hashedPassword;
  user!.save();
};

const forgotPassword = async (email: string) => {
  const isUserExist = await checkUserStatus(email);

  const JwtPayload = {
    userId: isUserExist!._id,
    role: isUserExist!.role,
    email: email,
  };

  const resetToken = generateToken(JwtPayload, envVar.JWT_ACCESS_SECRET, "10m");

  const resetLink = `${envVar.FRONTEND_URL}/reset-password?id=${isUserExist!._id}&token=${resetToken}`;

  sendEMail({
    to: isUserExist!.email as string,
    subject: "Gizmo Craft - Reset password",
    templateName: "forgotPassword",
    templateData: {
      name: isUserExist!.fullName,
      resetLink,
      expiryTime:"10 Minutes"
    },
  });
};

const resetPassword = async (id: string, password: string) => {
  const hashedPassword = await bcryptjs.hash(password, Number(envVar.BCRYPT_SALT_ROUND));

  await User.findByIdAndUpdate(id, { password: hashedPassword });
  return;
};

export const AuthServices = {
  credentialLogin,
  newAccessToken,
  changePassword,
  setPassword,
  resetPassword,
  forgotPassword,
};
