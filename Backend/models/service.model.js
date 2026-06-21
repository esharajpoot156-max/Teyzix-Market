import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    providerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    category: {
    type: String,
    required: true,
    enum: [
      "Web Development",
      "Graphic Design",
      "Content Writing",
      "Digital Marketing",
      "Social Media Management",
      "Video Editing",
      "Other",],
    }, 
    price: {
    type: Number,
    required: true,
    },
    deliveryTime: {
    type: Number,
    required: true
    },
    tags: {
    type: [String],
    default: [],
    },
    images: {
    type: [String],        // array of Cloudinary URLs
    default: [],
    },
    rating: {
    type: Number,
    default: 0,
    },

    totalReviews: {
    type: Number,
    default: 0,
    },

  // Is listing active or hidden
    isActive: {
    type: Boolean,
    default: true,
    },

}, { timestamps: true });


export default mongoose.model("Service",serviceSchema);