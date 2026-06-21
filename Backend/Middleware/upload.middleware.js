import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utilis/cloudinary.js";

// Profile pic storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "teyzix/profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});

// Portfolio storage
const portfolioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "teyzix/portfolio",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Service images storage
const serviceStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "teyzix/services",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

export const uploadProfile   = multer({ storage: profileStorage });
export const uploadPortfolio = multer({ storage: portfolioStorage });
export const uploadService   = multer({ storage: serviceStorage });