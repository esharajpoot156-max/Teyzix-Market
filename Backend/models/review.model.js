import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },

  // Kis provider ko review mila
    providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },

  // Kis service par review hai
    serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
    },

  // Kis request ke baad review diya
    requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true,
    },

  // Rating 1 se 5 tak
    rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    },

  // Customer ka feedback
    comment: {
    type: String,
    required: true,
    trim: true,
    },

}, { timestamps: true });

// ✅ Ek customer ek service par sirf ek baar review de sakta hai
reviewSchema.index({ customerId: 1, serviceId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);