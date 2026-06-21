import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// ✅ Register
export const register = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, isSeller } = req.body;

    // Email pehle se hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      isSeller,
      role: isSeller ? "provider" : "customer",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Password check karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    // Token banao
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Password hide karo
    const { password: pass, ...userInfo } = user._doc;

    // Cookie + Token dono bhejo
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",            // ← strict se none kiya
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).status(200).json({
      ...userInfo,
      token,                       // ← Token add kiya
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Logout
export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  }).status(200).json({ message: "Logged out successfully!" });
};