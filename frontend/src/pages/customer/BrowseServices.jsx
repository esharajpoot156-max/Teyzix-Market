import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function BrowseServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const categories = [
    { label: "Web Development",         emoji: "💻" },
    { label: "Graphic Design",          emoji: "🎨" },
    { label: "Content Writing",         emoji: "✍️" },
    { label: "Digital Marketing",       emoji: "📱" },
    { label: "Social Media Management", emoji: "📣" },
    { label: "Video Editing",           emoji: "🎬" },
    { label: "Other",                   emoji: "⚡" },
  ];

  const howItWorks = [
    { step: "01", title: "Browse Services",    desc: "Explore hundreds of services from top freelancers",      emoji: "🔍" },
    { step: "02", title: "Send a Request",     desc: "Share your requirements, budget and deadline",           emoji: "📝" },
    { step: "03", title: "Track Progress",     desc: "Monitor your project status in real time",               emoji: "📊" },
    { step: "04", title: "Get Delivered",      desc: "Receive your completed work and leave a review",         emoji: "🎉" },
  ];

  useEffect(() => {
    fetchServices();
  }, [search, category]);

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get("/services", {
        params: { search, category },
      });
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#FCF5EE" }} className="min-h-screen">

      {/* ─── HERO SECTION ─── */}
      <div
        style={{ backgroundColor: "#393c56" }}
        className="relative overflow-hidden px-6 py-20"
      >
        {/* Background Circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: "#fff", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: "#fff", transform: "translate(-30%, 30%)" }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-15 text-white text-xs px-4 py-2 rounded-full mb-6 font-medium">
            <span>✨</span>
            <span>Pakistan's #1 Freelance Marketplace</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Find the Perfect
            <span
              className="block mt-1"
              style={{ color: "#FCF5EE" }}
            >
              Freelance Service
            </span>
          </h1>

          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Connect with skilled professionals for web development, design, content writing and more
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-3 mb-10">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search for any service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-gray-800 focus:outline-none shadow-lg text-sm"
                style={{ backgroundColor: "#fff" }}
              />
            </div>
            <button
              style={{ backgroundColor: "#FCF5EE", color: "#393c56" }}
              className="px-6 py-4 rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 transition hover:scale-105 whitespace-nowrap"
            >
              Search →
            </button>
          </div>

          {/* Popular Searches */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-blue-200 text-xs">Popular:</span>
            {["Logo Design", "Website", "SEO", "Social Media"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearch(tag)}
                className="text-xs bg-white bg-opacity-15 text-white px-3 py-1 rounded-full hover:bg-opacity-25 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto">
            {[
              { num: `${services.length}+`, label: "Services" },
              { num: "100%",                label: "Satisfaction" },
              { num: "24/7",                label: "Support" },
            ].map((stat, i) => (
              <div key={i} className={i > 0 ? "border-l border-blue-400 pl-6" : ""}>
                <p className="text-white text-2xl font-bold">{stat.num}</p>
                <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CATEGORIES ─── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 style={{ color: "#1a1a2e" }} className="text-xl font-bold mb-5">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          <button
            onClick={() => setCategory("")}
            style={{
              backgroundColor: category === "" ? "#393c56" : "#fff",
              color:           category === "" ? "#fff"    : "#1a1a2e",
              borderColor:     category === "" ? "#393c56" : "#e5e0d8",
            }}
            className="flex flex-col items-center gap-1 p-3 rounded-2xl border hover:border-[#535DCA] transition text-center"
          >
            <span className="text-xl">🌟</span>
            <span className="text-xs font-medium">All</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategory(cat.label)}
              style={{
                backgroundColor: category === cat.label ? "#393c56" : "#fff",
                color:           category === cat.label ? "#fff"    : "#1a1a2e",
                borderColor:     category === cat.label ? "#393c56" : "#e5e0d8",
              }}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl border hover:border-[#535DCA] transition text-center"
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-xs font-medium leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* ─── SERVICES HEADING ─── */}
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ color: "#1a1a2e" }} className="text-xl font-bold">
            {category || "All Services"}
          </h2>
          <p className="text-sm text-gray-400">
            {services.length} services found
          </p>
        </div>

        {/* ─── SERVICES GRID ─── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div
              style={{ borderColor: "#393c56" }}
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p style={{ color: "#1a1a2e" }} className="text-xl font-bold mb-2">
              No services found!
            </p>
            <p className="text-gray-400 text-sm">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((service) => (
              <div
                key={service._id}
                onClick={() => navigate(`/services/${service._id}`)}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer group border border-[#e5e0d8] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                {service.images && service.images.length > 0 ? (
                  <div className="relative overflow-hidden h-44">
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div
                    style={{ backgroundColor: "#535DCA15" }}
                    className="h-44 flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                  >
                    <span className="text-6xl">
                      {categories.find(c => c.label === service.category)?.emoji || "⚡"}
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-4">

                  {/* Provider */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      style={{ backgroundColor: "#393c56" }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    >
                      {service.providerId?.username?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-xs text-gray-500 font-medium truncate">
                      {service.providerId?.username}
                    </p>
                    {service.rating > 0 && (
                      <div className="ml-auto flex items-center gap-1">
                        <span className="text-yellow-400 text-xs">⭐</span>
                        <span className="text-xs font-semibold text-gray-600">
                          {service.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    style={{ color: "#1a1a2e" }}
                    className="font-semibold text-sm mb-3 line-clamp-2 leading-snug group-hover:text-[#535DCA] transition-colors"
                  >
                    {service.title}
                  </h3>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#e5e0d8]">
                    <span
                      style={{ backgroundColor: "#535DCA10", color: "#393c56" }}
                      className="text-xs px-2 py-1 rounded-lg font-medium"
                    >
                      ⏱ {service.deliveryTime} days
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Starting at</p>
                      <p
                        style={{ color: "#393c56" }}
                        className="font-bold text-base"
                      >
                        ${service.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── HOW IT WORKS ─── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 style={{ color: "#1a1a2e" }} className="text-2xl font-bold mb-2">
              How It Works
            </h2>
            <p className="text-gray-400 text-sm">
              Get your project done in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative">
                {/* Connector Line */}
                {i < howItWorks.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-full w-full h-px z-0"
                    style={{ backgroundColor: "#535DCA30" }}
                  />
                )}
                <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8] text-center relative z-10 hover:shadow-md transition">
                  <div
                    style={{ backgroundColor: "#535DCA15" }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
                  >
                    {item.emoji}
                  </div>
                  <span
                    style={{ color: "#393c56" }}
                    className="text-xs font-bold"
                  >
                    Step {item.step}
                  </span>
                  <h3 style={{ color: "#1a1a2e" }} className="font-semibold text-sm mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CTA BANNER ─── */}
        <div
          style={{ backgroundColor: "#393c56" }}
          className="rounded-3xl p-10 text-center relative overflow-hidden mb-8"
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ backgroundColor: "#fff", transform: "translate(20%, -20%)" }}
          />
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">
            Ready to Get Started? 🚀
          </h2>
          <p className="text-blue-100 text-sm mb-6 relative z-10">
            Join thousands of satisfied customers and providers
          </p>
          <div className="flex justify-center gap-3 relative z-10">
            <button
              onClick={() => navigate("/register")}
              className="bg-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition hover:scale-105"
              style={{ color: "#393c56" }}
            >
              Join as Customer →
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white bg-opacity-20 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-opacity-30 transition"
            >
              Become a Provider
            </button>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer
        style={{ backgroundColor: "#1a1a2e" }}
        className="px-6 py-10 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            style={{ backgroundColor: "#393c56" }}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-white font-bold text-lg">
            Teyzix<span style={{ color: "#f0f0f1" }}>Market</span>
          </span>
        </div>
        <p className="text-gray-400 text-xs mb-4">
          Pakistan's trusted freelance marketplace
        </p>
        <div className="flex justify-center gap-6 text-xs text-gray-500">
          <span>Web Development</span>
          <span>•</span>
          <span>Graphic Design</span>
          <span>•</span>
          <span>Content Writing</span>
          <span>•</span>
          <span>Digital Marketing</span>
        </div>
        <p className="text-gray-600 text-xs mt-6">
          © 2026 TeyzixMarket. All rights reserved.
        </p>
      </footer>
    </div>
  );
}