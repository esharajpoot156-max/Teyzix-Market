import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [reqRes, servRes] = await Promise.all([
        axiosInstance.get("/requests/provider"),
        axiosInstance.get("/services/my"),
      ]);
      setRequests(reqRes.data);
      setServices(servRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/requests/${id}`, { status });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await axiosInstance.delete(`/services/${id}`);
      fetchAll();
    } catch (err) {
      alert("Could not delete service!");
    }
  };

  const nextStatus = (status) => {
    switch (status) {
      case "Pending":     return "Accepted";
      case "Accepted":    return "In Progress";
      case "In Progress": return "Completed";
      case "Completed":   return "Delivered";
      default:            return null;
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

  const pending   = requests.filter((r) => r.status === "Pending");
  const active    = requests.filter((r) => ["Accepted", "In Progress", "Completed"].includes(r.status));
  const delivered = requests.filter((r) => r.status === "Delivered");
  const earnings  = delivered.reduce((sum, r) => sum + r.budget, 0);

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
                <p className="text-blue-100 text-sm">Provider Dashboard</p>
                <h1 className="text-2xl font-bold text-white">
                  {user?.username} 👋
                </h1>
              </div>
            </div>
            <button
              onClick={() => navigate("/provider/services/new")}
              className="bg-white text-sm font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition"
                style={{ color: "#151c5c" }}
            >
              + Add Service
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">${earnings}</p>
              <p className="text-blue-100 text-xs mt-1">Total Earnings</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{pending.length}</p>
              <p className="text-blue-100 text-xs mt-1">Pending</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{active.length}</p>
              <p className="text-blue-100 text-xs mt-1">Active</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{delivered.length}</p>
              <p className="text-blue-100 text-xs mt-1">Delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1 border border-[#e5e0d8] w-fit">
          {["requests", "services"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor: activeTab === tab ? "#151c5c" : "transparent",
                color: activeTab === tab ? "#fff" : "#6b7280",
              }}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize"
            >
              {tab === "requests" ? `Requests (${requests.length})` : `My Services (${services.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div
              style={{ borderColor: "#151c5c" }}
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            />
          </div>
        ) : activeTab === "requests" ? (

          /* Requests Tab */
          requests.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📭</p>
              <p style={{ color: "#1a1a2e" }} className="text-lg font-semibold mb-2">
                No requests yet!
              </p>
              <p className="text-gray-400 text-sm">
                Add services to start receiving requests
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl p-5 border border-[#e5e0d8] hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div
                        style={{ backgroundColor: "#151c5c15" }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      >
                        👤
                      </div>
                      <div>
                        <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-1">
                          {req.serviceId?.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          From: {req.customerId?.username}
                        </p>
                        <div className="flex gap-4 text-xs text-gray-400 mt-1">
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

                  {/* Requirements */}
                  <div
                    style={{ backgroundColor: "#ffffff" }}
                    className="rounded-xl p-3 mb-4"
                  >
                    <p className="text-xs text-gray-500 font-medium mb-1">Requirements:</p>
                    <p className="text-sm text-gray-600">{req.requirements}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
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

                  {/* Action Button */}
                  {nextStatus(req.status) && (
                    <button
                      onClick={() => updateStatus(req._id, nextStatus(req.status))}
                      style={{ backgroundColor: "#151c5c" }}
                      className="text-white text-xs px-4 py-2 rounded-xl hover:opacity-90 transition font-medium"
                    >
                      Mark as {nextStatus(req.status)} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )

        ) : (

          /* Services Tab */
          services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🛠️</p>
              <p style={{ color: "#1a1a2e" }} className="text-lg font-semibold mb-2">
                No services yet!
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Create your first service listing
              </p>
              <button
                onClick={() => navigate("/provider/services/new")}
                style={{ backgroundColor: "#151c5c" }}
                className="text-white px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition"
              >
                + Add Service →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden hover:shadow-md transition"
                >
                  {/* Image */}
                  {service.images?.length > 0 ? (
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: "#151c5c15" }}
                      className="w-full h-36 flex items-center justify-center text-4xl"
                    >
                      💼
                    </div>
                  )}

                  <div className="p-4">
                    <h3 style={{ color: "#1a1a2e" }} className="font-semibold text-sm mb-1 line-clamp-1">
                      {service.title}
                    </h3>
                    <div className="flex justify-between items-center mb-3">
                      <span
                        style={{ backgroundColor: "#151c5c15", color: "#151c5c" }}
                        className="text-xs px-2 py-1 rounded-lg"
                      >
                        {service.category}
                      </span>
                      <span style={{ color: "#151c5c" }} className="font-bold text-sm">
                        ${service.price}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/services/${service._id}`)}
                        style={{ borderColor: "#151c5c", color: "#151c5c" }}
                        className="flex-1 text-xs py-2 rounded-xl border font-medium hover:opacity-70 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteService(service._id)}
                        className="flex-1 text-xs py-2 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}