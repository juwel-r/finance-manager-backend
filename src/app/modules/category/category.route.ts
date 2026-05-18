import { Router } from "express";
import { CategoryController } from "./category.controller";
import { zodValidation } from "../../middlewares/zodValidation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { createCategoryZod, updateCategoryZod } from "./category.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(ERole)),
  zodValidation(createCategoryZod),
  CategoryController.createCategory,
);

router.get(
  "/my-categories",
  checkAuth(...Object.values(ERole)),
  CategoryController.getMyCategories,
);

router.get(
  "/:id",
  checkAuth(...Object.values(ERole)),
  CategoryController.getSingleCategory,
);

router.patch(
  "/:id",
  checkAuth(...Object.values(ERole)),
  zodValidation(updateCategoryZod),
  CategoryController.updateCategory,
);

router.patch(
  "/archive/:id",
  checkAuth(...Object.values(ERole)),
  CategoryController.archiveCategory,
);

export const CategoryRouter = router;