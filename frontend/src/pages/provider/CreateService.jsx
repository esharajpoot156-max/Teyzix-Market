import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function CreateService() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
    tags: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    { label: "Web Development",         emoji: "💻" },
    { label: "Graphic Design",          emoji: "🎨" },
    { label: "Content Writing",         emoji: "✍️" },
    { label: "Digital Marketing",       emoji: "📱" },
    { label: "Social Media Management", emoji: "📣" },
    { label: "Video Editing",           emoji: "🎬" },
    { label: "Other",                   emoji: "⚡" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title",        form.title);
      formData.append("description",  form.description);
      formData.append("category",     form.category);
      formData.append("price",        Number(form.price));
      formData.append("deliveryTime", Number(form.deliveryTime));
      formData.append("tags",         form.tags);
      images.forEach((img) => formData.append("images", img));
      await axiosInstance.post("/services", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/provider/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong!");
    } finally {
    setLoading(false);}
  };

  return (
    <div style={{ backgroundColor: "#FCF5EE" }} className="min-h-screen">

      {/* Header */}
      <div style={{ backgroundColor: "#393c56" }} className="px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/provider/dashboard")}
            className="text-blue-100 text-sm mb-3 hover:text-white transition flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">
            Create New Service
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Fill in the details to list your service
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-8">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
            <label style={{ color: "#1a1a2e" }} className="block text-sm font-semibold mb-2">
              Service Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. I will design a professional logo"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
              onBlur={(e) => e.target.style.boxShadow = "none"}
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
            <label style={{ color: "#1a1a2e" }} className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your service in detail — what you offer, process, and results..."
              rows={5}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
              onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
              onBlur={(e) => e.target.style.boxShadow = "none"}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {form.description.length} characters
            </p>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
            <label style={{ color: "#1a1a2e" }} className="block text-sm font-semibold mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.label })}
                  style={{
                    backgroundColor: form.category === cat.label ? "#393c56" : "#fff",
                    color:           form.category === cat.label ? "#fff"    : "#1a1a2e",
                    borderColor:     form.category === cat.label ? "#393c56" : "#e5e0d8",
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all hover:border-[#393c56]"
                >
                  <span>{cat.emoji}</span>
                  <span className="text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price + Delivery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
              <label style={{ color: "#1a1a2e" }} className="block text-sm font-semibold mb-2">
                💰 Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 50"
                required
                min="1"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                onBlur={(e) => e.target.style.boxShadow = "none"}
              />
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
              <label style={{ color: "#1a1a2e" }} className="block text-sm font-semibold mb-2">
                ⏱️ Delivery (days)
              </label>
              <input
                type="number"
                name="deliveryTime"
                value={form.deliveryTime}
                onChange={handleChange}
                placeholder="e.g. 3"
                required
                min="1"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                onBlur={(e) => e.target.style.boxShadow = "none"}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
            <label style={{ color: "#1a1a2e" }} className="block text-sm font-semibold mb-2">
              🏷️ Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. logo, design, branding"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
              onBlur={(e) => e.target.style.boxShadow = "none"}
            />
            {form.tags && (
              <div className="flex gap-2 flex-wrap mt-2">
                {form.tags.split(",").map((tag, i) => (
                  tag.trim() && (
                    <span
                      key={i}
                      style={{ backgroundColor: "#393c5615", color: "#393c56" }}
                      className="text-xs px-2 py-1 rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
            <label style={{ color: "#1a1a2e" }} className="block text-sm font-semibold mb-2">
              🖼️ Service Images (max 5)
            </label>
            <label
              style={{ borderColor: "#393c56", color: "#393c56" }}
              className="cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 hover:opacity-70 transition"
            >
              <span className="text-3xl">📸</span>
              <span className="text-sm font-medium">Click to upload images</span>
              <span className="text-xs text-gray-400">JPG, PNG supported</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden h-24">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        Image {i + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/provider/dashboard")}
              style={{ borderColor: "#393c56", color: "#393c56" }}
              className="flex-1 border-2 py-3 rounded-xl text-sm font-semibold hover:opacity-70 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#393c56" }}
              className="flex-1 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition hover:scale-[1.01]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating...
                </span>
              ) : "Create Service →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}