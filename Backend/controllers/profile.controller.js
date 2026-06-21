import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

// ✅ Profile banao ya update karo
export const updateProfile = async (req, res) => {
  try {
    const { bio, skills, experience, socialLinks } = req.body;

    // Profile pic upload hui?
    const imgUrl = req.file ? req.file.path : null;

    // User ki img update karo
    if (imgUrl) {
      await User.findByIdAndUpdate(req.userId, { img: imgUrl });
    }

    // Skills string se array banao
    const skillsArray = skills
      ? skills.split(",").map((s) => s.trim())
      : [];

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        userId: req.userId,
        bio,
        skills: skillsArray,
        experience,
        socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
      },
      { new: true, upsert: true }
    );

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Profile dekho
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId })
      .populate("userId", "username email img");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found!" });
    }

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Portfolio item add karo
export const addPortfolio = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : null;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        $push: {
          portfolio: { title, description, image },
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Portfolio item delete karo
export const deletePortfolio = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        $pull: {
          portfolio: { _id: req.params.portfolioId },
        },
      },
      { new: true }
    );

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};