import Service from "../models/service.model.js";

// Sari services dekho (search + filter)
export const getAllServices = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice } = req.query;
        const filters = { isActive: true };
        if (category) filters.category = category;
        if (search)   filters.title = { 
            $regex: search, 
            $options: "i" };
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = Number(minPrice);
            if (maxPrice) filters.price.$lte = Number(maxPrice);
        }
        const services = await Service.find(filters)
        .populate("providerId", "username email img")
        .sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Ek service ka detail
export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
        .populate("providerId", "username email img description");
        if (!service) {
            return res.status(404).json({ 
                message: "Service not found!" });
            }
            res.status(200).json(service);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
};

// Provider ki apni sari services
export const getProviderServices = async (req, res) => {
    try {
        const services = await Service.find({ providerId: req.userId })
        .sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//  Service update karo
export const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found!" });
        }

    // Sirf apni service update kar sako
        if (service.providerId.toString() !== req.userId) {
            return res.status(403).json({ message: "You can only update your own service!" });
        }
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedService);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Service delete karo
export const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found!" });
        }

    // Sirf apni service delete kar sako
        if (service.providerId.toString() !== req.userId) {
            return res.status(403).json({ message: "You can only delete your own service!" });
        }
        await Service.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Service deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const createService = async (req, res) => {
  try {
    // Images Cloudinary se aa rahi hain
    const images = req.files ? req.files.map((f) => f.path) : [];

    const newService = new Service({
      providerId: req.userId,
      ...req.body,
      images,
      price:        Number(req.body.price),
      deliveryTime: Number(req.body.deliveryTime),
      tags: req.body.tags ? req.body.tags.split(",").map((t) => t.trim()) : [],
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
