import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { zodValidation } from "../../middlewares/zodValidation";
import { updateUserZod } from "../user/user.validation";

const router = Router();

router.post("/login", AuthController.credentialLogin);
router.post("/logout", AuthController.logout);
router.post("/new-access-token", checkAuth(...Object.values(ERole)), AuthController.newAccessToken);
router.post("/change-password", zodValidation(updateUserZod), checkAuth(...Object.values(ERole)), AuthController.changePassword);
router.post("/set-password", zodValidation(updateUserZod), checkAuth(...Object.values(ERole)), AuthController.setPassword);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", checkAuth(...Object.values(ERole)), AuthController.resetPassword);

export const AuthRouter = router;
