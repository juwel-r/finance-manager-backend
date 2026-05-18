import { Router } from "express";
import { ReportController } from "./report.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";

const router = Router();

router.get("/dashboard", checkAuth(ERole.admin, ERole.user), ReportController.getDashboard);
router.get("/monthly", checkAuth(ERole.admin, ERole.user), ReportController.getMonthlyTrend);
router.get("/category-summary", checkAuth(ERole.admin, ERole.user), ReportController.getCategorySummary);
router.get("/account-summary", checkAuth(ERole.admin, ERole.user), ReportController.getAccountSummary);

export const ReportRoutes = router;