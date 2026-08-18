import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function VerifyOtp() {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await verifyOtp({ email, otp });
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      const res = await resendOtp({ email });
      setMessage(res.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP!");
    }
  };

  return (
    <div
      style={{ backgroundColor: "#ffffff" }}
      className="min-h-screen flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-sm bg-white p-10 rounded-3xl shadow-2xl">
        <h2 style={{ color: "#1a1a2e" }} className="text-2xl font-bold mb-1">
          Verify Your Email
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Enter the OTP sent to {email}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-center tracking-widest focus:outline-none"
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #151c5c40")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#151c5c" }}
            className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
          >
            {loading ? "Verifying..." : "Verify Email →"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            style={{ color: "#151c5c" }}
            className="w-full text-sm font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Wrong email?{" "}
          <Link to="/register" style={{ color: "#151c5c" }} className="font-semibold hover:underline">
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
}