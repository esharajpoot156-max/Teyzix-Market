import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Kis provider ko request gayi
    providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },

  // Kaunsi service ke liye request hai
    serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
    },

  // Customer ne kya likha
    requirements: {
    type: String,
    required: true,
    },

  // Customer ka budget
    budget: {
    type: Number,
    required: true,
    min: 1,
    },

  // Customer ki deadline
    deadline: {
    type: Date,
    required: true,
    },

  // Project ka status track hoga yahan
    status: {
    type: String,
    enum: ["Pending", "Accepted", "In Progress", "Completed", "Delivered"],
    default: "Pending",
    },

  // Provider ne kab accept kiya
    acceptedAt: {
    type: Date,
    default: null,
    },

  // Kab deliver hua
    deliveredAt: {
    type: Date,
    default: null,
    },

}, { timestamps: true });

export default mongoose.model("Request", requestSchema);