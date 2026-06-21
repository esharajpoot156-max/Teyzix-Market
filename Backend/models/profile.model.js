import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: {
    type: String,
    default: "",
  },
  portfolio: [
    {
      title:       { type: String },
      description: { type: String },
      image:       { type: String }, // Cloudinary URL
    },
  ],
  socialLinks: {
    linkedin: { type: String, default: "" },
    github:   { type: String, default: "" },
    website:  { type: String, default: "" },
  },
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);