import { v2 as cloudinary } from "cloudinary";
import { envVar } from "./env.config";

cloudinary.config({
  cloud_name: envVar.CLOUDINARY_CLOUD_NAME,
  api_key: envVar.CLOUDINARY_API_KEY,
  api_secret: envVar.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;
