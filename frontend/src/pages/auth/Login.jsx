import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role === "provider") navigate("/provider/dashboard");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: "#eeeeed" }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden">

        {/* Left Side */}
        <div
          style={{ backgroundColor: "#393c56" }}
          className="hidden md:flex flex-col justify-between p-10 text-white"
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span style={{ color: "#393c56" }} className="font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold">TeyzixMarket</span>
          </div>

          {/* Middle Content */}
          <div>
            <h2 className="text-3xl font-bold mb-4 leading-snug">
              Welcome Back! 👋
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-8">
              Login to access your dashboard, manage requests, and connect with top freelancers.
            </p>

            {/* Features */}
            {[
              { icon: "✅", text: "Browse 100+ services" },
              { icon: "⚡", text: "Fast project delivery" },
              { icon: "🔒", text: "Secure payments" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <span className="text-lg">{item.icon}</span>
                <p className="text-sm text-blue-100">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <p className="text-blue-200 text-xs">
            © 2026 TeyzixMarket. All rights reserved.
          </p>
        </div>

        {/* Right Side — Form */}
        <div className="bg-white p-10 flex flex-col justify-center">

          {/* Heading */}
          <h2 style={{ color: "#1a1a2e" }} className="text-2xl font-bold mb-1">
            Sign In
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter your credentials to continue
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label
                style={{ color: "#1a1a2e" }}
                className="block text-sm font-medium mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  📧
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "#393c56" }}
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{ color: "#1a1a2e" }}
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #393c5640"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#393c56" }}
              className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition hover:scale-[1.01] active:scale-[0.99] shadow-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <p className="text-xs text-gray-400">OR</p>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ color: "#393c56" }}
              className="font-semibold hover:underline"
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}