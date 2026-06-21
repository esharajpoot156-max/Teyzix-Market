import express from "express";
import { getAllUsers, getUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../Middleware/isAuthentucated.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/", verifyAdmin, getAllUsers);

export default router;