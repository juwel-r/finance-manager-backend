import { Account } from "../account/account.model";
import { Category } from "../category/category.model";
import { Transaction } from "../transaction/transaction.model";
import { ETransactionType } from "../transaction/transaction.interface";
import { Types } from "mongoose";

const getDashboard = async (userId: string) => {
  
  const totals = await Transaction.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const income = totals.find((item) => item._id === ETransactionType.income)?.total || 0;
  const expense = totals.find((item) => item._id === ETransactionType.expense)?.total || 0;
  const transfer = totals.find((item) => item._id === ETransactionType.transfer)?.total || 0;

  const accounts = await Account.find({ userId, isArchived: false }).sort({ createdAt: -1 }).lean();
  const categories = await Category.find({ userId, isArchived: false }).sort({ createdAt: -1 }).lean();
  const recentTransactions = await Transaction.find({ userId }).sort({ transactionDate: -1 }).limit(10).lean();

  return {
    summary: {
      income,
      expense,
      transfer,
      balance: income - expense,
    },
    accounts,
    categories,
    recentTransactions,
  };
};

const getMonthlyTrend = async (userId: string, year: number) => {
  const trend = await Transaction.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        transactionDate: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$transactionDate" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.month": 1 },
    },
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const result = months.map((month, index) => {
    const monthNumber = index + 1;
    return {
      month,
      income: trend.find((t) => t._id.month === monthNumber && t._id.type === ETransactionType.income)?.total || 0,
      expense: trend.find((t) => t._id.month === monthNumber && t._id.type === ETransactionType.expense)?.total || 0,
      transfer: trend.find((t) => t._id.month === monthNumber && t._id.type === ETransactionType.transfer)?.total || 0,
    };
  });

  return result;
};

const getCategorySummary = async (userId: string) => {
  return Transaction.aggregate([
    {
      $match: {
        userId:new Types.ObjectId(userId),
        type: ETransactionType.expense,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $group: {
        _id: {
          categoryId: "$category._id",
          categoryName: "$category.name",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);
};

const getAccountSummary = async (userId: string) => {
  const accounts = await Account.find({ userId, isArchived: false }).sort({ currentBalance: -1 }).lean();
  return accounts.map((account) => ({
    accountId: account._id,
    accountName: account.name,
    currentBalance: account.currentBalance,
  }));
};

export const ReportServices = {
  getDashboard,
  getMonthlyTrend,
  getCategorySummary,
  getAccountSummary,
};
