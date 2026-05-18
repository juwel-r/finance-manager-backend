import { Router } from "express";
import { AccountController } from "./account.controller";
import { zodValidation } from "../../middlewares/zodValidation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { createAccountZod, updateAccountZod } from "./account.validation";


const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(ERole)),
  zodValidation(createAccountZod),
  AccountController.createAccount,
);

router.get(
  "/my-accounts",
  checkAuth(...Object.values(ERole)),
  AccountController.getMyAccounts,
);

router.get(
  "/:id",
  checkAuth(...Object.values(ERole)),
  AccountController.getSingleAccount,
);

router.patch(
  "/:id",
  checkAuth(...Object.values(ERole)),
  zodValidation(updateAccountZod),
  AccountController.updateAccount,
);

router.patch(
  "/archive/:id",
  checkAuth(...Object.values(ERole)),
  AccountController.archiveAccount,
);

export const AccountRouter = router;