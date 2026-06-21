import Request from "../models/request.model.js";

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