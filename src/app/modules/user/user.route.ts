import { Router } from "express";
import { UserController } from "./user.controller";
import { zodValidation } from "../../middlewares/zodValidation";
import { ERole } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { registerUserZod } from "./user.validation";

const router = Router();

router.post("/register", zodValidation(registerUserZod), UserController.registerUser);
router.get("/all-user", checkAuth(ERole.admin, ERole.user), UserController.getAllUser);
router.get("/get-me", checkAuth(...Object.values(ERole)), UserController.getMe);
router.get("/:id", checkAuth(ERole.admin), UserController.getSingleUser);
router.patch("/:id", checkAuth(...Object.values(ERole)), UserController.updateUser);
router.delete("/:id", checkAuth(ERole.admin), UserController.deleteUser);

export const UserRouter = router;