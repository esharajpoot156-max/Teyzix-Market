import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [requestSent, setRequestSent] = useState(false);

  const [form, setForm] = useState({
    requirements: "",
    budget: "",
    deadline: "",
  });

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    fetchService();
    fetchReviews();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await axiosInstance.get(`/services/${id}`);
      setService(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      await axiosInstance.post("/requests", {
        serviceId: id,
        providerId: service.providerId._id,
        ...form,
      });
      setRequestSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/reviews", {
        serviceId: id,
        providerId: service.providerId._id,
        ...reviewForm,
      });
      setReviewSuccess("Review submitted successfully!");
      fetchReviews();
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const categoryEmoji = (cat) => {
    switch (cat) {
      case "Web Development":         return "💻";
      case "Graphic Design":          return "🎨";
      case "Content Writing":         return "✍️";
      case "Digital Marketing":       return "📱";
      case "Video Editing":           return "🎬";
      case "Social Media Management": return "📣";
      default:                        return "⚡";
    }
  };

  if (loading) return (
    <div style={{ backgroundColor: "#eeeeed" }} className="min-h-screen flex items-center justify-center">
      <div style={{ borderColor: "#535DCA" }} className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!service) return (
    <div style={{ backgroundColor: "#eeeeed" }} className="min-h-screen flex items-center justify-center">
      <p style={{ color: "#1a1a2e" }} className="text-xl font-semibold">Service not found!</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#eeeeed" }} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{ color: "#535DCA" }}
          className="flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition"
        >
          ← Back to Services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Service Images */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e0d8]">
              {service.images?.length > 0 ? (
                <>
                  <img
                    src={service.images[activeImg]}
                    alt={service.title}
                    className="w-full h-72 object-cover"
                  />
                  {service.images.length > 1 && (
                    <div className="flex gap-2 p-3">
                      {service.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          onClick={() => setActiveImg(i)}
                          className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition ${
                            activeImg === i ? "border-[#535DCA]" : "border-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div
                  style={{ backgroundColor: "#535DCA15" }}
                  className="w-full h-72 flex items-center justify-center"
                >
                  <span className="text-8xl">{categoryEmoji(service.category)}</span>
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e0d8]">
              <div className="flex items-center gap-2 mb-3">
                <span
                  style={{ backgroundColor: "#535DCA15", color: "#535DCA" }}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                >
                  {service.category}
                </span>
              </div>
              <h1 style={{ color: "#1a1a2e" }} className="text-2xl font-bold mb-3">
                {service.title}
              </h1>

              {/* Provider */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  style={{ backgroundColor: "#393c56" }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                >
                  {service.providerId?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ color: "#1a1a2e" }} className="font-semibold text-sm">
                    {service.providerId?.username}
                  </p>
                  <p className="text-xs text-gray-400">{service.providerId?.email}</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span style={{ color: "#1a1a2e" }} className="font-semibold text-sm">
                    {service.rating || "0"}
                  </span>
                  <span className="text-gray-400 text-xs">({service.totalReviews || 0} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Tags */}
              {service.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {service.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{ backgroundColor: "#eeeeed", color: "#535DCA" }}
                      className="text-xs px-3 py-1 rounded-full border border-[#e5e0d8]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e0d8]">
              <h2 style={{ color: "#1a1a2e" }} className="text-lg font-bold mb-4">
                Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-2">💬</p>
                  <p className="text-gray-400 text-sm">No reviews yet!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-[#e5e0d8] pb-4 last:border-0"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          style={{ backgroundColor: "#393c56" }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        >
                          {review.customerId?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ color: "#1a1a2e" }} className="font-semibold text-sm">
                            {review.customerId?.username}
                          </p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="ml-auto text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm pl-11">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Form */}
              {user?.role === "customer" && (
                <div className="mt-6 pt-6 border-t border-[#e5e0d8]">
                  <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-3">
                    Leave a Review
                  </h3>
                  {reviewSuccess && (
                    <p className="bg-green-50 text-green-600 p-3 rounded-xl text-sm mb-3">
                      ✅ {reviewSuccess}
                    </p>
                  )}
                  <form onSubmit={handleReview} className="space-y-3">
                    {/* Star Rating */}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`text-2xl transition hover:scale-110 ${
                            star <= reviewForm.rating ? "text-yellow-400" : "text-gray-200"
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Share your experience..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #535DCA40"}
                      onBlur={(e) => e.target.style.boxShadow = "none"}
                    />
                    <button
                      type="submit"
                      style={{ backgroundColor: "#393c56" }}
                      className="text-white px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Sticky Order Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden shadow-lg">

              {/* Price */}
              <div style={{ backgroundColor: "#393c56" }} className="p-5 text-white">
                <p className="text-sm opacity-80 mb-1">Starting at</p>
                <p className="text-3xl font-bold">${service.price}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs opacity-80">
                    <span>⏱️</span>
                    <span>{service.deliveryTime} days delivery</span>
                  </div>
                </div>
              </div>

              {/* Request Form */}
              <div className="p-5">
                {requestSent ? (
                  <div className="text-center py-6">
                    <p className="text-4xl mb-2">🎉</p>
                    <p style={{ color: "#1a1a2e" }} className="font-semibold mb-1">
                      Request Sent!
                    </p>
                    <p className="text-gray-400 text-xs mb-4">
                      Provider will get back to you soon
                    </p>
                    <button
                      onClick={() => navigate("/dashboard")}
                      style={{ backgroundColor: "#393c56" }}
                      className="w-full text-white py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                    >
                      View My Requests
                    </button>
                  </div>
                ) : user?.role === "customer" ? (
                  <form onSubmit={handleRequest} className="space-y-3">
                    <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-3">
                      Send a Request
                    </h3>
                    <textarea
                      rows={3}
                      placeholder="Describe your requirements..."
                      value={form.requirements}
                      onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #535DCA40"}
                      onBlur={(e) => e.target.style.boxShadow = "none"}
                    />
                    <input
                      type="number"
                      placeholder="Your budget ($)"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #535DCA40"}
                      onBlur={(e) => e.target.style.boxShadow = "none"}
                    />
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #535DCA40"}
                      onBlur={(e) => e.target.style.boxShadow = "none"}
                    />
                    <button
                      type="submit"
                      style={{ backgroundColor: "#393c56" }}
                      className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition hover:scale-[1.01]"
                    >
                      Send Request →
                    </button>
                  </form>
                ) : !user ? (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm mb-3">
                      Login to send a request
                    </p>
                    <button
                      onClick={() => navigate("/login")}
                      style={{ backgroundColor: "#393c56" }}
                      className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
                    >
                      Login to Continue →
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-gray-400 text-sm py-4">
                    Providers cannot send requests
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}