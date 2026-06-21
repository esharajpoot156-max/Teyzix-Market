import express from "express";
import { createReview, getServiceReviews, deleteReview } from "../controllers/review.controller.js";
import { verifyToken, verifyCustomer } from "../Middleware/isAuthentucated.js";

const router = express.Router();

router.post("/", verifyCustomer, createReview);
router.get("/:serviceId", getServiceReviews);
router.delete("/:id", verifyCustomer, deleteReview);

export default router;