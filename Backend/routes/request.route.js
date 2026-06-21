import express from "express";
import { getAllRequests, createRequest, getMyRequests, getProviderRequests, getSingleRequest, updateStatus } from "../controllers/request.controller.js";
import { verifyToken, verifyCustomer, verifyProvider, verifyAdmin } from "../Middleware/isAuthentucated.js";

const router = express.Router();

router.post("/", verifyCustomer, createRequest);
router.get("/my", verifyCustomer, getMyRequests);
router.get("/provider", verifyProvider, getProviderRequests);
router.get("/:id", verifyToken, getSingleRequest);
router.put("/:id", verifyProvider, updateStatus);
router.get("/", verifyAdmin, getAllRequests); 

export default router;