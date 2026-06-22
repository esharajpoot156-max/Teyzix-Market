import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: [], services: [], requests: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, services, requests] = await Promise.all([
        axiosInstance.get("/users"),
        axiosInstance.get("/services"),
        axiosInstance.get("/requests"),
      ]);
      setStats({
        users: users.data,
        services: services.data,
        requests: requests.data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axiosInstance.delete(`/users/${id}`);
      fetchStats();
    } catch (err) {
      alert("Could not delete user!");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await axiosInstance.delete(`/services/${id}`);
      fetchStats();
    } catch (err) {
      alert("Could not delete service!");
    }
  };

  const customers = stats.users.filter((u) => u.role === "customer");
  const providers = stats.users.filter((u) => u.role === "provider");
  const delivered = stats.requests.filter((r) => r.status === "Delivered");
  const pending   = stats.requests.filter((r) => r.status === "Pending");
  const earnings  = delivered.reduce((sum, r) => sum + r.budget, 0);

  const tabs = ["overview", "users", "services", "requests"];

  return (
    <div style={{ backgroundColor: "#ffffff" }} className="min-h-screen">

      {/* Header Banner */}
      <div style={{ backgroundColor: "#151c5c" }} className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center text-3xl">
                🛡️
              </div>
              <div>
                <p className="text-blue-100 text-sm">Admin Panel</p>
                <h1 className="text-2xl font-bold text-white">
                  Welcome, {user?.username}!
                </h1>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{stats.users.length}</p>
              <p className="text-blue-100 text-xs mt-1">Total Users</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{customers.length}</p>
              <p className="text-blue-100 text-xs mt-1">Customers</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{providers.length}</p>
              <p className="text-blue-100 text-xs mt-1">Providers</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">{stats.services.length}</p>
              <p className="text-blue-100 text-xs mt-1">Services</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-white">${earnings}</p>
              <p className="text-blue-100 text-xs mt-1">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1 border border-[#e5e0d8] w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
                style={{
                backgroundColor: activeTab === tab ? "#151c5c" : "transparent",
                color: activeTab === tab ? "#fff" : "#6b7280",
              }}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize"
            >
              {tab}
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
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
                  <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-4">
                    📊 Project Status
                  </h3>
                  <div className="space-y-3">
                    {["Pending", "Accepted", "In Progress", "Completed", "Delivered"].map((status) => {
                      const count = stats.requests.filter((r) => r.status === status).length;
                      const percent = stats.requests.length
                        ? Math.round((count / stats.requests.length) * 100)
                        : 0;
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{status}</span>
                            <span>{count}</span>
                          </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              style={{ backgroundColor: "#151c5c", width: `${percent}%` }}
                              className="h-2 rounded-full transition-all"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
                  <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-4">
                    🏆 Top Categories
                  </h3>
                            <div className="space-y-3">
                    {["Web Development", "Graphic Design", "Content Writing", "Digital Marketing", "Other"].map((cat) => {
                      const count = stats.services.filter((s) => s.category === cat).length;
                      return (
                        <div key={cat} className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{cat}</span>
                          <span
                            style={{ backgroundColor: "#151c5c15", color: "#151c5c" }}
                            className="text-xs px-2 py-1 rounded-lg font-medium"
                          >
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8]">
                  <h3 style={{ color: "#1a1a2e" }} className="font-semibold mb-4">
                    👥 User Breakdown
                  </h3>
                    <div className="space-y-4">
                    {[
                      { label: "Customers", count: customers.length, emoji: "👤" },
                      { label: "Providers", count: providers.length, emoji: "💼" },
                      { label: "Admins",    count: stats.users.filter(u => u.role === "admin").length, emoji: "🛡️" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: "#151c5c15" }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        >
                          {item.emoji}
                        </div>
                        <div>
                          <p style={{ color: "#1a1a2e" }} className="font-semibold text-sm">
                            {item.count}
                          </p>
                          <p className="text-xs text-gray-400">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden">
                <div className="p-4 border-b border-[#e5e0d8] flex justify-between items-center">
                  <h3 style={{ color: "#1a1a2e" }} className="font-semibold">
                    All Users ({stats.users.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: "#ffffff" }}>
                      <tr>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">User</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Role</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Joined</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.users.map((u) => (
                        <tr key={u._id} className="border-t border-[#e5e0d8] hover:bg-[#ffffff] transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                style={{ backgroundColor: "#151c5c" }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              >
                                {u.username?.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ color: "#1a1a2e" }} className="font-medium">
                                {u.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{u.email}</td>
                          <td className="px-4 py-3">
                            <span
                              style={{
                                backgroundColor:
                                  u.role === "admin"    ? "#FEF2F2" :
                                  u.role === "provider" ? "#EFF6FF" : "#F0FDF4",
                                color:
                                  u.role === "admin"    ? "#DC2626" :
                                  u.role === "provider" ? "#1D4ED8" : "#15803D",
                              }}
                              className="text-xs px-2 py-1 rounded-full font-medium"
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {u.role !== "admin" && (
                              <button
                                onClick={() => deleteUser(u._id)}
                                className="text-xs text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden">
                <div className="p-4 border-b border-[#e5e0d8]">
                  <h3 style={{ color: "#1a1a2e" }} className="font-semibold">
                    All Services ({stats.services.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: "#ffffff" }}>
                      <tr>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Title</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Provider</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Rating</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.services.map((s) => (
                        <tr key={s._id} className="border-t border-[#e5e0d8] hover:bg-[#ffffff] transition">
                          <td className="px-4 py-3">
                            <p style={{ color: "#1a1a2e" }} className="font-medium line-clamp-1">
                              {s.title}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              style={{ backgroundColor: "#151c5c15", color: "#151c5c" }}
                              className="text-xs px-2 py-1 rounded-lg"
                            >
                              {s.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold" style={{ color: "#151c5c" }}>
                            ${s.price}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {s.providerId?.username}
                          </td>
                          <td className="px-4 py-3 text-yellow-500 text-xs">
                            ⭐ {s.rating} ({s.totalReviews})
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteService(s._id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "requests" && (
              <div className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden">
                <div className="p-4 border-b border-[#e5e0d8]">
                  <h3 style={{ color: "#1a1a2e" }} className="font-semibold">
                    All Requests ({stats.requests.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: "#ffffff" }}>
                      <tr>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Service</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Provider</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Budget</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.requests.map((r) => (
                        <tr key={r._id} className="border-t border-[#e5e0d8] hover:bg-[#ffffff] transition">
                          <td className="px-4 py-3">
                            <p style={{ color: "#1a1a2e" }} className="font-medium line-clamp-1">
                              {r.serviceId?.title}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {r.customerId?.username}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {r.providerId?.username}
                          </td>
                          <td className="px-4 py-3 font-semibold" style={{ color: "#151c5c" }}>
                            ${r.budget}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              style={{
                                backgroundColor:
                                  r.status === "Pending"     ? "#FFF7ED" :
                                  r.status === "Accepted"    ? "#EFF6FF" :
                                  r.status === "In Progress" ? "#F5F3FF" :
                                  r.status === "Completed"   ? "#F0FDF4" : "#F8FAFC",
                                color:
                                  r.status === "Pending"     ? "#C2410C" :
                                  r.status === "Accepted"    ? "#1D4ED8" :
                                  r.status === "In Progress" ? "#6D28D9" :
                                  r.status === "Completed"   ? "#15803D" : "#475569",
                              }}
                              className="text-xs px-2 py-1 rounded-full font-medium"
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}