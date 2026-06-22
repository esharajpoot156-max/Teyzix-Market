import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    isSeller: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: "#ffffff" }}
      className="min-h-screen flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden">

        {/* Left Side */}
        <div
          style={{ backgroundColor: "#151c5c" }}
          className="hidden md:flex flex-col justify-between p-10 text-white"
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span style={{ color: "#1a1a2e" }} className="font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold">TeyzixMarket</span>
          </div>

          {/* Middle */}
          <div>
            <h2 className="text-3xl font-bold mb-4 leading-snug">
              Join TeyzixMarket! 🚀
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-8">
              Create your account and start connecting with top freelancers or offer your services today.
            </p>

            {/* Role Cards */}
            <div className="space-y-3">
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <p className="font-semibold text-sm mb-1">👤 As a Customer</p>
                <p className="text-blue-100 text-xs">
                  Browse services, hire freelancers, track projects
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <p className="font-semibold text-sm mb-1">💼 As a Provider</p>
                <p className="text-blue-100 text-xs">
                  Create listings, get hired, grow your business
                </p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <p className="text-blue-200 text-xs">
            © 2026 TeyzixMarket. All rights reserved.
          </p>
        </div>

        {/* Right Side — Form */}
        <div className="bg-white p-10 flex flex-col justify-center">

          <h2 style={{ color: "#1a1a2e" }} className="text-2xl font-bold mb-1">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Fill in your details to get started
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label style={{ color: "#1a1a2e" }} className="block text-sm font-medium mb-1">
                Username
              </label>
              <div className="relative">
              
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Your username"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #151c5c40"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ color: "#1a1a2e" }} className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #151c5c40"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ color: "#1a1a2e" }} className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #151c5c40"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? "hide" : "👁️"}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={{ color: "#1a1a2e" }} className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">#</span>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="03001234567"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #151c5c40"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
              </div>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, isSeller: false })}
                style={{
                  borderColor: !form.isSeller ? "#151c5c" : "#e5e7eb",
                  backgroundColor: !form.isSeller ? "#151c5c10" : "#fff",
                  color: !form.isSeller ? "#151c5c" : "#6b7280",
                }}
                className="py-3 rounded-xl border-2 text-sm font-medium transition-all"
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, isSeller: true })}
                style={{
                  borderColor: form.isSeller ? "#151c5c" : "#e5e7eb",
                  backgroundColor: form.isSeller ? "#151c5c10" : "#fff",
                  color: form.isSeller ? "#151c5c" : "#6b7280",
                }}
                className="py-3 rounded-xl border-2 text-sm font-medium transition-all"
              >
                💼 Provider
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#151c5c" }}
              className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition hover:scale-[1.01] active:scale-[0.99] shadow-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "#151c5c" }}
              className="font-semibold hover:underline"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}