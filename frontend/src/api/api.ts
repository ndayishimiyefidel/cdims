import axios, { type AxiosInstance } from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "https://cyangugudims.com/api";

// Normalize API base URL so env can be either domain-only or full /api URL.
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, "");
export const API_URL: string = normalizedApiUrl.endsWith("/api")
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

// Create an axios instance with a base URL
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // ❌ Don't send cookies
});

// Attach Authorization header dynamically if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token"); // or sessionStorage if you prefer
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: unwrap data, handle errors globally
api.interceptors.response.use(
  (response) => {
    // If the backend returned an explicit error, reject it
    if (response.data?.success === false) {
      return Promise.reject(new Error(response.data?.message || 'Request failed'));
    }
    // Unwrap inner data when available (backend always wraps in { success, data, message })
    // When data is null/undefined (e.g. logout, delete), return the full response
    // Use nullish coalescing - return full response when data is null (e.g., logout, delete endpoints)
    return response.data?.data ?? response.data;
  },
  (error) => {
    // Handle 401 Unauthorized — clear token and redirect only if on a protected route
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Only redirect to login if on a protected /admin route (not public landing pages)
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/auth/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
