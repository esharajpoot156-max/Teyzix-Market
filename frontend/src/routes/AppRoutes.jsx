import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Customer Pages
import CustomerDashboard from "../pages/customer/Dashboard";
import BrowseServices from "../pages/customer/BrowseServices";
import ServiceDetail from "../pages/customer/ServiceDetail";

// Provider Pages
import ProviderDashboard from "../pages/provider/Dashboard";
import CreateService from "../pages/provider/CreateService";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";

// Profile
import Profile from "../pages/Profile";  

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/unauthorized" />;
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/"             element={<BrowseServices />} />
      <Route path="/login"        element={<Login />} />
      <Route path="/register"     element={<Register />} />
      <Route path="/services/:id" element={<ServiceDetail />} />

      {/* Profile Route */}
      <Route path="/Profile" element={        
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />

      {/* Customer Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute role="customer">
          <CustomerDashboard />
        </PrivateRoute>
      } />

      {/* Provider Routes */}
      <Route path="/provider/dashboard" element={
        <PrivateRoute role="provider">
          <ProviderDashboard />
        </PrivateRoute>
      } />
      <Route path="/provider/services/new" element={
        <PrivateRoute role="provider">
          <CreateService />
        </PrivateRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <PrivateRoute role="admin">
          <AdminDashboard />
        </PrivateRoute>
      } />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-red-500">Access Denied!</h1>
        </div>
      } />
    </Routes>
  );
}