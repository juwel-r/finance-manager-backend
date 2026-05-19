import z from "zod";
import { ERole } from "./user.interface";

export const registerUserZod = z.object({
  fullName: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name at-least 2 character" })
    .max(20, { message: "Name can't exceed 20 character" }),

  email: z.email({ message: "Email is not valid" }).optional(),

  phone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, {
      message: "Please provide a valid Bangladeshi phone number.",
    })
    .optional(),

  password: z.string().min(6, { message: "Password must be at least 6 character." }).optional(),
});

export const updateUserZod = z.object({
  fullName: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name at-least 2 character" })
    .max(20, { message: "Name can't exceed 20 character" })
    .optional(),

  email: z.email({ message: "Email is not valid" }).optional(),

  phone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, {
      message: "Please provide a valid Bangladeshi phone number.",
    })
    .optional(),

  password: z.string().min(6, { message: "Password must be at least 6 character." }).optional(),
  oldPassword: z.string().min(6, { message: "Password must be at least 6 character." }).optional(),
  newPassword: z.string().min(6, { message: "Password must be at least 6 character." }).optional(),

  role: z.enum([ERole.admin, ERole.user]).optional(),
  avatar: z.string().optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
});
