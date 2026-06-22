import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://teyzix-market-production.up.railway.app/api",
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default axiosInstance;