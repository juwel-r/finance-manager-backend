import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { zodValidation } from "../../middlewares/zodValidation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { createTransactionZod, updateTransactionZod } from "./transaction.validation";

const router = Router();

router.post("/create", checkAuth(...Object.values(ERole)), zodValidation(createTransactionZod), TransactionController.createTransaction);

router.get("/my-transactions", checkAuth(...Object.values(ERole)), TransactionController.getMyTransactions);

router.get("/type", checkAuth(...Object.values(ERole)), TransactionController.getTransactionsByType);

router.get("/:id", checkAuth(...Object.values(ERole)), TransactionController.getSingleTransaction);


router.patch("/:id", checkAuth(...Object.values(ERole)), zodValidation(updateTransactionZod), TransactionController.updateTransaction);

router.delete("/:id", checkAuth(...Object.values(ERole)), TransactionController.deleteTransaction);

export const TransactionRouter = router;
