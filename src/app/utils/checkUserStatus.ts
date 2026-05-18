
import statusCode from "http-status";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";

export const checkUserStatus = async (
  email?: string,
  phone?: string,
  id?: string,
) => {
  let isUserExist;

  // const user = await User.findOne({
  //   $or: [
  //     { email },
  //     { phone },
  //      {_id:id}
  //   ]
  // });

  if (email) {
    isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      throw new AppError(
        statusCode.NOT_FOUND,
        "User not found with this email.",
      );
    }
  } else if (phone) {
    isUserExist = await User.findOne({ phone });
    if (!isUserExist) {
      throw new AppError(
        statusCode.NOT_FOUND,
        "User not found with this phone number.",
      );
    }
  }

  if (id) {
    isUserExist = await User.findById(id);
    if (!isUserExist) {
      throw new AppError(statusCode.NOT_FOUND, "User not found with this _id.");
    }
  }

  if (isUserExist?.isBlocked) {
    throw new AppError(statusCode.FORBIDDEN, "This user is blocked.");
  }
  return isUserExist;
};
