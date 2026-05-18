import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { statusCode } from "../../utils/statusCode";
import { Account } from "../account/account.model";
import { Transaction } from "./transaction.model";
import { ETransactionType, type ITransaction } from "./transaction.interface";

const createTransaction = async (payload: ITransaction) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { type, amount, fromAccountId, toAccountId, userId } = payload;

    const fromAccount = fromAccountId
      ? await Account.findOne({ _id: fromAccountId, userId, isArchived: false }).session(session)
      : null;

    const toAccount = toAccountId
      ? await Account.findOne({ _id: toAccountId, userId, isArchived: false }).session(session)
      : null;

    if (type === ETransactionType.expense) {
      if (!fromAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Expense account not found.");
      }

      if (fromAccount.currentBalance < amount) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
      }

      fromAccount.currentBalance -= amount;
      await fromAccount.save({ session });
    }

    if (type === ETransactionType.income) {
      if (!toAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Income account not found.");
      }

      toAccount.currentBalance += amount;
      await toAccount.save({ session });
    }

    if (type === ETransactionType.transfer) {
      if (!fromAccount || !toAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Transfer accounts not found.");
      }

      if (fromAccount.currentBalance < amount) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
      }

      fromAccount.currentBalance -= amount;
      toAccount.currentBalance += amount;

      await fromAccount.save({ session });
      await toAccount.save({ session });
    }

    const transaction = await Transaction.create([payload], { session });

    await session.commitTransaction();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getMyTransactions = async (userId: string) => {
  const transactions = await Transaction.find({ userId }).sort({ transactionDate: -1 });
  return transactions;
};

const getSingleTransaction = async (id: string, userId: string) => {
  const transaction = await Transaction.findOne({ _id: id, userId });
  if (!transaction) {
    throw new AppError(statusCode.NOT_FOUND, "Transaction not found.");
  }
  return transaction;
};

const updateTransaction = async (id: string, userId: string, payload: Partial<ITransaction>) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true, runValidators: true },
  );

  if (!transaction) {
    throw new AppError(statusCode.NOT_FOUND, "Transaction not found.");
  }

  return transaction;
};

const deleteTransaction = async (id: string, userId: string) => {
  const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
  if (!transaction) {
    throw new AppError(statusCode.NOT_FOUND, "Transaction not found.");
  }
  return transaction;
};

export const TransactionServices = {
  createTransaction,
  getMyTransactions,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
};