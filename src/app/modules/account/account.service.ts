import AppError from "../../errorHelpers/AppError";
import { statusCode } from "../../utils/statusCode";
import { Account } from "./account.model";
import type { IAccount } from "./account.interface";

const createAccount = async (payload: IAccount) => {
  if (payload.isDefault) {
    const isExistDefaultCategory = await Account.findOne({ isDefault: true });

    if (isExistDefaultCategory && !payload.forceDefault) {
      throw new AppError(statusCode.CONFLICT, "Already have a default account.");
    }

    if (payload.forceDefault) {
      await Account.findOneAndUpdate({ isDefault: true }, { isDefault: false });
    }
  }
  if (!payload.currentBalance) {
    payload.currentBalance = payload.openingBalance;
  }

  const account = await Account.create(payload);
  return account;
};

const getMyAccounts = async (userId: string) => {
  const accounts = await Account.find({
    userId,
    isArchived: false,
  }).sort({ createdAt: -1 });

  return accounts;
};

const getSingleAccount = async (id: string, userId: string) => {
  const account = await Account.findOne({
    _id: id,
    userId,
    isArchived: false,
  });

  if (!account) {
    throw new AppError(statusCode.NOT_FOUND, "Account not found.");
  }

  return account;
};

const updateAccount = async (id: string, userId: string, payload: Partial<IAccount>) => {
  if (payload.isDefault) {
    const isExistDefaultCategory = await Account.findOne({ isDefault: true });

    if (isExistDefaultCategory && !payload.forceDefault) {
      throw new AppError(statusCode.CONFLICT, "Already have a default account.");
    }

    if (payload.forceDefault) {
      await Account.findOneAndUpdate({ isDefault: true }, { isDefault: false });
    }
  }

  const account = await Account.findOneAndUpdate(
    {
      _id: id,
      userId,
      isArchived: false,
    },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!account) {
    throw new AppError(statusCode.NOT_FOUND, "Account not found.");
  }

  return account;
};

const archiveAccount = async (id: string, userId: string) => {
  const account = await Account.findOneAndUpdate(
    {
      _id: id,
      userId,
      isArchived: false,
    },
    {
      isArchived: true,
    },
    {
      new: true,
    },
  );

  if (!account) {
    throw new AppError(statusCode.NOT_FOUND, "Account not found.");
  }

  return account;
};

export const AccountServices = {
  createAccount,
  getMyAccounts,
  getSingleAccount,
  updateAccount,
  archiveAccount,
};
