import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// ✅ Check karo JWT token valid hai ya nahi
export const verifyToken = async (req, res, next) => {
  // Cookie se bhi lo — Header se bhi lo
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId   = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is not valid!" });
  }
};

// ✅ Sirf Provider access kar sakta hai
export const verifyProvider = async (req, res, next) => {
    await verifyToken(req, res, async () => {
        if (req.userRole === "provider" || req.userRole === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Only providers allowed!" });
        }});
};

// ✅ Sirf Customer access kar sakta hai
export const verifyCustomer = async (req, res, next) => {
    await verifyToken(req, res, async () => {
        if (req.userRole === "customer" || req.userRole === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Only customers allowed!" })
        }
    });
};

// ✅ Sirf Admin access kar sakta hai
export const verifyAdmin = async (req, res, next) => {
    await verifyToken(req, res, async () => {
        if (req.userRole === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Only admin allowed!" })
        }
    });
};
