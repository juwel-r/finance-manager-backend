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

    const { type, amount, sourceAccountId, destinationAccountId, userId } = payload;

    const fromAccount = sourceAccountId ? await Account.findOne({ _id: sourceAccountId, userId, isArchived: false }).session(session) : null;

    const toAccount = destinationAccountId ? await Account.findOne({ _id: destinationAccountId, userId, isArchived: false }).session(session) : null;

    if (type === ETransactionType.expense) {
      if (!fromAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Source account not found.");
      }

      if (fromAccount.currentBalance < amount) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
      }

      fromAccount.currentBalance -= amount;
      await fromAccount.save({ session });
    }

    if (type === ETransactionType.income) {
      if (!toAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Destination account not found.");
      }

      toAccount.currentBalance += amount;
      await toAccount.save({ session });
    }

    if (type === ETransactionType.transfer) {
      if (!fromAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Source account not found.");
      }
      if (!toAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Destination account not found.");
      }

      if (fromAccount.currentBalance < amount) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance in source account.");
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

const getTransactionsByType = async (userId: string, type: ETransactionType) => {
  const validTypes = Object.values(ETransactionType);
  if (!validTypes.includes(type as ETransactionType)) {
    throw new AppError(statusCode.BAD_REQUEST, "Invalid transaction type");
  }
  const transactions = await Transaction.find({ type, userId }).sort({ createdAt: -1 });
  return transactions;
};

const updateTransaction = async (id: string, userId: string, payload: Partial<ITransaction>) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const oldTransaction = await Transaction.findOne({ _id: id, userId }).session(session);

    if (!oldTransaction) {
      throw new AppError(statusCode.NOT_FOUND, "Transaction not found.");
    }

    const oldType = oldTransaction.type;
    const oldAmount = oldTransaction.amount;
    const oldSourceAccountId = oldTransaction.sourceAccountId;
    const oldDestinationAccountId = oldTransaction.destinationAccountId;

    const newType = payload.type || oldType;
    const newAmount = payload.amount ?? oldAmount;
    const newSourceAccountId = payload.sourceAccountId ?? oldSourceAccountId;
    const newDestinationAccountId = payload.destinationAccountId ?? oldDestinationAccountId;

    const oldFromAccount = oldSourceAccountId
      ? await Account.findOne({
          _id: oldSourceAccountId,
          userId,
          isArchived: false,
        }).session(session)
      : null;

    const oldToAccount = oldDestinationAccountId
      ? await Account.findOne({
          _id: oldDestinationAccountId,
          userId,
          isArchived: false,
        }).session(session)
      : null;

    if (oldType === ETransactionType.expense) {
      if (!oldFromAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Source account not found.");
      }

      oldFromAccount.currentBalance += oldAmount;
      await oldFromAccount.save({ session });
    }

    if (oldType === ETransactionType.income) {
      if (!oldToAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Destination account not found.");
      }

      oldToAccount.currentBalance -= oldAmount;
      await oldToAccount.save({ session });
    }

    if (oldType === ETransactionType.transfer) {
      if (!oldFromAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Source account not found.");
      }
      if (!oldToAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Destination account not found.");
      }

      oldFromAccount.currentBalance += oldAmount;
      oldToAccount.currentBalance -= oldAmount;

      await oldFromAccount.save({ session });
      await oldToAccount.save({ session });
    }

    const newFromAccount = newSourceAccountId
      ? await Account.findOne({
          _id: newSourceAccountId,
          userId,
          isArchived: false,
        }).session(session)
      : null;

    const newToAccount = newDestinationAccountId
      ? await Account.findOne({
          _id: newDestinationAccountId,
          userId,
          isArchived: false,
        }).session(session)
      : null;

    if (newType === ETransactionType.expense) {
      if (!newFromAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Source account not found.");
      }

      if (newFromAccount.currentBalance < newAmount) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
      }

      newFromAccount.currentBalance -= newAmount;
      await newFromAccount.save({ session });

      oldTransaction.type = ETransactionType.expense;
      oldTransaction.amount = newAmount;
      oldTransaction.sourceAccountId = newSourceAccountId;
      oldTransaction.destinationAccountId = undefined;
      oldTransaction.categoryId = payload.categoryId || oldTransaction.categoryId;
      oldTransaction.note = payload.note ?? oldTransaction.note;
    }

    if (newType === ETransactionType.income) {
      if (!newToAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Destination account not found.");
      }

      newToAccount.currentBalance += newAmount;
      await newToAccount.save({ session });

      oldTransaction.type = ETransactionType.income;
      oldTransaction.amount = newAmount;
      oldTransaction.destinationAccountId = newDestinationAccountId;
      oldTransaction.sourceAccountId = undefined;
      oldTransaction.categoryId = payload.categoryId || oldTransaction.categoryId;
      oldTransaction.note = payload.note ?? oldTransaction.note;
    }

    if (newType === ETransactionType.transfer) {
      if (!newFromAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Source account not found.");
      }
      if (!newToAccount) {
        throw new AppError(statusCode.NOT_FOUND, "Destination account not found.");
      }

      if (String(newSourceAccountId) === String(newDestinationAccountId)) {
        throw new AppError(statusCode.BAD_REQUEST, "Source and destination accounts cannot be same.");
      }

      if (newFromAccount.currentBalance < newAmount) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance in source account.");
      }

      newFromAccount.currentBalance -= newAmount;
      newToAccount.currentBalance += newAmount;

      await newFromAccount.save({ session });
      await newToAccount.save({ session });

      oldTransaction.type = ETransactionType.transfer;
      oldTransaction.amount = newAmount;
      oldTransaction.sourceAccountId = newSourceAccountId;
      oldTransaction.destinationAccountId = newDestinationAccountId;
      oldTransaction.categoryId = undefined;
      oldTransaction.note = payload.note ?? oldTransaction.note;
    }

    oldTransaction.transactionDate = payload.transactionDate ? new Date(payload.transactionDate) : oldTransaction.transactionDate;

    const updatedTransaction = await oldTransaction.save({ session });

    await session.commitTransaction();
    return updatedTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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
  getTransactionsByType,
  updateTransaction,
  deleteTransaction,
};
