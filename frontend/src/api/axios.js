import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

instance.interceptors.request.use((config) => {
  // ✅ Use admin token for admin routes, regular token for everything else
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");

  if (config.url.startsWith("/admin") && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

export default instance;