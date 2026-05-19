import AppError from "../../errorHelpers/AppError";
import { statusCode } from "../../utils/statusCode";
import { Category } from "./category.model";
import type { ICategory } from "./category.interface";

const createCategory = async (payload: ICategory) => {
  if (payload.isDefault) {
    const isExistDefaultCategory = await Category.findOne({ isDefault: true });

    if (isExistDefaultCategory && !payload.forceDefault) {
      throw new AppError(statusCode.CONFLICT, "Already have a default category.");
    }

    if (payload.forceDefault) {
      await Category.findOneAndUpdate({ isDefault: true }, { isDefault: false });
    }
  }

  const category = await Category.create(payload);
  return category;
};

const getMyCategories = async (userId: string) => {
  const categories = await Category.find({
    userId,
    isArchived: false,
  }).sort({ name: 1 });

  return categories;
};

const getSingleCategory = async (id: string, userId: string) => {
  const category = await Category.findOne({
    _id: id,
    userId,
    isArchived: false,
  });

  if (!category) {
    throw new AppError(statusCode.NOT_FOUND, "Category not found.");
  }

  return category;
};

const updateCategory = async (id: string, userId: string, payload: Partial<ICategory>) => {
  if (payload.isDefault) {
    const isExistDefaultCategory = await Category.findOne({ isDefault: true });

    if (isExistDefaultCategory && !payload.forceDefault) {
      throw new AppError(statusCode.CONFLICT, "Already have a default category.");
    }

    if (payload.forceDefault) {
      await Category.findOneAndUpdate({ isDefault: true }, { isDefault: false });
    }
  }

  const category = await Category.findOneAndUpdate(
    {
      _id: id,
      userId,
      isArchived: false,
    },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!category) {
    throw new AppError(statusCode.NOT_FOUND, "Category not found.");
  }

  return category;
};

const archiveCategory = async (id: string, userId: string) => {
  const category = await Category.findOneAndUpdate(
    {
      _id: id,
      userId,
      isArchived: false,
    },
    {
      isArchived: true,
    },
    {
      new: true,
    },
  );

  if (!category) {
    throw new AppError(statusCode.NOT_FOUND, "Category not found.");
  }

  return category;
};

export const CategoryServices = {
  createCategory,
  getMyCategories,
  getSingleCategory,
  updateCategory,
  archiveCategory,
};
