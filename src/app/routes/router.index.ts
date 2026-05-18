import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { CategoryRouter } from "../modules/category/category.route";
import { AccountRouter } from "../modules/account/account.route";
import { ReportRoutes } from "../modules/report/report.routes";
import { TransactionRouter } from "../modules/transaction/transaction.route";

export const router = Router();

const modulesRoutes = [
  { path: "/auth", route: AuthRouter },
  { path: "/users", route: UserRouter },
  { path: "/accounts", route: AccountRouter },
  { path: "/categories", route: CategoryRouter },
  { path: "/transactions", route: TransactionRouter },
  { path: "/reports", route: ReportRoutes },
];

modulesRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
