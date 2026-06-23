import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to bypass aggressive Hostinger CDN caching
api.interceptors.request.use((config) => {
  if (config.method === 'get') {
    config.params = config.params || {};
    config.params._t = Date.now();
  }
  return config;
});

export default api;
