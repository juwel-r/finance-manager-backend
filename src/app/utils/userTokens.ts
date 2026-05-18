import { envVar } from "../config/env.config";
import type { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserToken = (payload: Partial<IUser>) => {
  const jwtPayload = {
    uid: payload?._id,
    role: payload?.role,
  };

  const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRES);
  const refreshToken = generateToken(jwtPayload, envVar.JWT_REFRESH_SECRET, envVar.JWT_REFRESH_EXPIRES);

  return {
    accessToken,
    refreshToken,
  };
};
