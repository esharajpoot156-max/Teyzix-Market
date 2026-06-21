import { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Register
  const register = async (data) => {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  };

  // Login
  const login = async (data) => {
    const res = await axiosInstance.post("/auth/login", data);
    localStorage.setItem("user", JSON.stringify(res.data));
    setUser(res.data);
  };

  // Logout
  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);