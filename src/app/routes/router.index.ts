import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";

export const router = Router();

const modulesRoutes = [
  { path: "/user", route: UserRouter },
  { path: "/auth", route: AuthRouter },
];

modulesRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
