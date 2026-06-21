import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://teyzix-market-production.up.railway.app/api",
  withCredentials: true,
});

export default axiosInstance;