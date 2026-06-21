import express from "express";
import { createService, getAllServices, getServiceById, getProviderServices, updateService, deleteService } from "../controllers/service.controller.js";
import { verifyToken, verifyProvider } from "../Middleware/isAuthentucated.js";
import { uploadService } from "../Middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/my", verifyProvider, getProviderServices);
router.get("/:id", getServiceById);
router.post("/", verifyProvider, createService);
router.put("/:id", verifyProvider, updateService);
router.delete("/:id", verifyProvider, deleteService);
router.post("/", verifyProvider, uploadService.array("images", 5), createService);

export default router;
