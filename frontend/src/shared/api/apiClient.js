import axios from "axios";

// Shared axios instance that attaches the JWT Bearer token from localStorage
const apiClient = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
   withCredentials: true,
});

// Interceptor: attach token from localStorage as Authorization header
apiClient.interceptors.request.use((config) => {
   const token = localStorage.getItem("token");
   if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
   }
   return config;
});

export default apiClient;

