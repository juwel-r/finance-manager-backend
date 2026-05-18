export interface IDashboardSummary {
  income: number;
  expense: number;
  transfer: number;
  balance: number;
}

export interface IMonthlyTrend {
  month: string;
  income: number;
  expense: number;
  transfer: number;
}

export interface ICategorySummary {
  categoryId: string;
  categoryName: string;
  total: number;
  type: "income" | "expense";
}

export interface IAccountSummary {
  accountId: string;
  accountName: string;
  currentBalance: number;
}