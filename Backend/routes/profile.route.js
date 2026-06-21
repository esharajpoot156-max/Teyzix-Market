import express from "express";
import {
  updateProfile,
  getProfile,
  addPortfolio,
  deletePortfolio,
} from "../controllers/profile.controller.js";
import { verifyToken } from "../Middleware/isAuthentucated.js";
import { uploadProfile, uploadPortfolio } from "../Middleware/upload.middleware.js";

const router = express.Router();

router.get("/:userId", getProfile);
router.put("/", verifyToken, uploadProfile.single("img"), updateProfile);
router.post("/portfolio", verifyToken, uploadPortfolio.single("image"), addPortfolio);
router.delete("/portfolio/:portfolioId", verifyToken, deletePortfolio);

export default router;