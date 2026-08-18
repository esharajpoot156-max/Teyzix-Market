import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendOTPEmail } from "../utilis/sendEmail.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      isSeller,
      role: isSeller ? "provider" : "customer",
      isVerified: false,
      otp,
      otpExpiry,
    });

    await newUser.save();

    await sendOTPEmail(email, otp);

    res.status(201).json({ message: "User registered! OTP sent to email.", email });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified!" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "No OTP found, please request a new one." });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired, please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified!" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "New OTP sent to email." });

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

    // Verified check karo
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in.", email: user.email });
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