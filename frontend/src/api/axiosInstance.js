import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "teyzix-market-production.up.railway.app",
  withCredentials: true, // cookies automatically jayengi
});

export default axiosInstance;