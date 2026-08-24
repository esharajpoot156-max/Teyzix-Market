import Request from "../models/request.model.js";
import stripe from "../utilis/stripe.js";

// ✅ Get all requests (admin only)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("customerId", "username email")
      .populate("providerId", "username email")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Request banao (Customer only)
export const createRequest = async (req, res) => {
  try {
    const newRequest = new Request({
      customerId: req.userId,
      ...req.body,
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Customer ki apni requests
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ customerId: req.userId })
      .populate("serviceId", "title price")
      .populate("providerId", "username img")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Provider ki incoming requests
export const getProviderRequests = async (req, res) => {
  try {
    const requests = await Request.find({ providerId: req.userId })
      .populate("serviceId", "title price")
      .populate("customerId", "username img")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Single request ka detail
export const getSingleRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("serviceId", "title price deliveryTime")
      .populate("customerId", "username img")
      .populate("providerId", "username img");

    if (!request) return res.status(404).json({ message: "Request not found!" });

    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Status update karo (Provider only)
export const updateStatus = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found!" });

    // Sirf apni request update kar sako
    if (request.providerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    // Timestamps update karo
    if (req.body.status === "Accepted")  req.body.acceptedAt  = new Date();
    if (req.body.status === "Delivered") req.body.deliveredAt = new Date();

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Payment Intent banao (Customer only) — request Accepted hone ke baad
export const createPaymentIntent = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found!" });

    if (request.customerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    if (request.status !== "Accepted") {
      return res.status(400).json({ message: "Request must be accepted before payment." });
    }

    if (request.paymentStatus === "Paid") {
      return res.status(400).json({ message: "This request is already paid." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(request.budget * 100), // cents mein
      currency: "usd",
      metadata: { requestId: request._id.toString() },
    });

    request.paymentIntentId = paymentIntent.id;
    await request.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Payment confirm karo (Customer only) — Stripe se success confirm hone ke baad
export const confirmPayment = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found!" });

    if (request.customerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(request.paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not completed yet." });
    }

    request.paymentStatus = "Paid";
    request.paidAt = new Date();
    await request.save();

    res.status(200).json({ message: "Payment confirmed!", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};