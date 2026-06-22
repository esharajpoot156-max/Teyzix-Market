import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/requests/my");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Pending":     return { bg: "#FFF7ED", color: "#C2410C" };
      case "Accepted":    return { bg: "#EFF6FF", color: "#1D4ED8" };
      case "In Progress": return { bg: "#F5F3FF", color: "#6D28D9" };
      case "Completed":   return { bg: "#F0FDF4", color: "#15803D" };
      case "Delivered":   return { bg: "#F8FAFC", color: "#475569" };
      default:            return { bg: "#F8FAFC", color: "#475569" };
    }
  };

  const statusEmoji = (status) => {
    switch (status) {
      case "Pending":     return "⏳";
      case "Accepted":    return "✅";
      case "In Progress": return "🔨";
      case "Completed":   return "🎯";
      case "Delivered":   return "📦";
      default:            return "📋";
    }
  };

  const active    = requests.filter((r) => r.status !== "Delivered");
  const completed = requests.filter((r) => r.status === "Delivered");
  const earnings  = completed.reduce((sum, r) => sum + r.budget, 0);

  return (
    <div style={{ backgroundColor: "#ffffff" }} className="min-h-screen">

      {/* Header Banner */}
      <div style={{ backgroundColor: "#151c5c" }} className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center text-white text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-blue-100 text-sm">Welcome back,</p>
                <h1 className="text-2xl font-bold text-white">
                  {user?.username} 👋
                </h1>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-white bg-opacity-20 text-white text-sm px-4 py-2 rounded-xl hover:bg-opacity-30 transition"
            >
              + Browse Services
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{requests.length}</p>
              <p className="text-blue-100 text-xs mt-1">Total Requests</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{active.length}</p>
              <p className="text-blue-100 text-xs mt-1">Active</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{completed.length}</p>
              <p className="text-blue-100 text-xs mt-1">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1 border border-[#e5e0d8] w-fit">
          <button
            onClick={() => setActiveTab("active")}
            style={{
              backgroundColor: activeTab === "active" ? "#151c5c" : "transparent",
              color: activeTab === "active" ? "#fff" : "#6b7280",
            }}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
          >
            Active ({active.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            style={{
              backgroundColor: activeTab === "completed" ? "#151c5c" : "transparent",
              color: activeTab === "completed" ? "#fff" : "#6b7280",
            }}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
          >
            Completed ({completed.length})
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
              <div
              style={{ borderColor: "#151c5c" }}
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            />
          </div>
        ) : (

          /* Active Tab */
          activeTab === "active" ? (
            active.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">📭</p>
                <p style={{ color: "#1a1a2e" }} className="text-lg font-semibold mb-2">
                  No active requests!
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Browse services and send your first request
                </p>
                <button
                  onClick={() => navigate("/")}
                  style={{ backgroundColor: "#151c5c" }}
                  className="text-white px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition"
                >
                  Browse Services →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {active.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl p-5 border border-[#e5e0d8] hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div
                          style={{ backgroundColor: "#151c5c15" }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        >
                          📋
                        </div>
                        <div>
                          <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-1">
                            {req.serviceId?.title}
                          </h3>
                          <p className="text-xs text-gray-400 mb-2">
                            Provider: {req.providerId?.username}
                          </p>
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>💰 ${req.budget}</span>
                            <span>📅 {new Date(req.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div
                        style={{
                          backgroundColor: statusColor(req.status).bg,
                          color: statusColor(req.status).color,
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        <span>{statusEmoji(req.status)}</span>
                        <span>{req.status}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>
                          {req.status === "Pending"     ? "20%" :
                           req.status === "Accepted"    ? "40%" :
                           req.status === "In Progress" ? "60%" :
                           req.status === "Completed"   ? "80%" :
                           req.status === "Delivered"   ? "100%" : "0%"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          style={{
                            backgroundColor: "#151c5c",
                            width:
                              req.status === "Pending"     ? "20%" :
                              req.status === "Accepted"    ? "40%" :
                              req.status === "In Progress" ? "60%" :
                              req.status === "Completed"   ? "80%" :
                              req.status === "Delivered"   ? "100%" : "0%",
                          }}
                          className="h-2 rounded-full transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )

          /* Completed Tab */
          ) : (
            completed.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🏆</p>
                <p style={{ color: "#1a1a2e" }} className="text-lg font-semibold mb-2">
                  No completed projects yet!
                </p>
                <p className="text-gray-400 text-sm">
                  Your completed projects will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completed.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl p-5 border border-[#e5e0d8] hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div
                          style={{ backgroundColor: "#F0FDF4" }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        >
                          ✅
                        </div>
                        <div>
                          <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-1">
                            {req.serviceId?.title}
                          </h3>
                          <p className="text-xs text-gray-400 mb-2">
                            Provider: {req.providerId?.username}
                          </p>
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>💰 ${req.budget}</span>
                            <span>📅 {new Date(req.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        style={{ backgroundColor: "#F0FDF4", color: "#15803D" }}
                        className="text-xs px-3 py-1 rounded-full font-medium"
                      >
                        📦 Delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}