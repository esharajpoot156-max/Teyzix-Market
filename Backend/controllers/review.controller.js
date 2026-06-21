import Review from "../models/review.model.js";
import Service from "../models/service.model.js";
import Request from "../models/request.model.js";

// ✅ Review banao (Customer only)
export const createReview = async (req, res) => {
  try {
    // Ensure customer had a delivered/completed request for this service
    const matchingRequest = await Request.findOne({
      customerId: req.userId,
      serviceId: req.body.serviceId,
      status: { $in: ["Delivered", "Completed"] },
    });

    if (!matchingRequest) {
      return res.status(400).json({ message: "You can only review after the project is completed." });
    }

    // Ek customer ek service par sirf ek baar review de sakta hai
    const existing = await Review.findOne({
      customerId: req.userId,
      serviceId: req.body.serviceId,
    });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this service!" });
    }

    const newReview = new Review({
      customerId: req.userId,
      ...req.body,
    });
    await newReview.save();

    // Service ki average rating update karo
    const reviews = await Review.find({ serviceId: req.body.serviceId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Service.findByIdAndUpdate(req.body.serviceId, {
      rating: avgRating.toFixed(1),
      totalReviews: reviews.length,
    });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Service ki sari reviews dekho
export const getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId })
      .populate("customerId", "username img")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Review delete karo (Customer only)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found!" });

    // Sirf apni review delete kar sako
    if (review.customerId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own review!" });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Rating dobara calculate karo
    const reviews = await Review.find({ serviceId: review.serviceId });
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await Service.findByIdAndUpdate(review.serviceId, {
      rating: avgRating.toFixed(1),
      totalReviews: reviews.length,
    });

    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};