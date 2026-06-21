import User from "../models/user.model.js";

// ✅ Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ User profile dekho
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found!", 
                success: false });
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
};

// ✅ Profile update karo
export const updateUser = async (req, res) => {
    try {// Sirf apna account update kar sako
        if (req.userId !== req.params.id) {
            return res.status(403).json({
                message: "You can only update your own account!", 
                success: false });
            }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).select("-password");
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Account delete karo
export const deleteUser = async (req, res) => {
    try {// Sirf apna account delete kar sako
        if (req.userId !== req.params.id) {
            return res.status(403).json({ message: "You can only delete your own account!" });
        }
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("accessToken").status(200).json({ 
            message: "Account deleted successfully!" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
};