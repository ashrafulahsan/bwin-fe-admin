import axios from "axios";
import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, isUsableToken } from "@/constants/constants";
import { useAuthStore } from "@/store/authStore";

// Base HTTP client. Module-level services (e.g. modules/auth/services) should build on this
// rather than calling axios/fetch directly.
export const apiClient = axios.create({
  baseURL: API_BASE_URL || "http://127.0.0.1:8000/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (isUsableToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== "undefined") {
          const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
          if (isUsableToken(refreshToken)) {
            const response = await axios.post(
              `${API_BASE_URL || "http://127.0.0.1:8000/api/v1"}/auth/refresh`,
              { refresh_token: refreshToken }
            );

            // Every response is wrapped in `{success, message, data}`, and
            // refresh tokens are single-use/rotated — the backend revokes the
            // whole session if a used one is replayed, so the new
            // refresh_token must be persisted too, not just the access token.
            // Validate before storing: writing a bad value here would look
            // "logged in" (truthy) while silently failing every real request.
            const tokens = response.data?.data;
            if (!isUsableToken(tokens?.access_token) || !isUsableToken(tokens?.refresh_token)) {
              throw new Error("Refresh response did not include usable tokens");
            }
            window.localStorage.setItem(TOKEN_STORAGE_KEY, tokens.access_token);
            window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refresh_token);
            useAuthStore.getState().setAccessToken(tokens.access_token);
            originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(TOKEN_STORAGE_KEY);
          window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response?.data?.message);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.warn("Resource not found:", error.response?.data?.message);
    }

    // Handle 500+ Server errors
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response?.data?.message);
    }

    return Promise.reject(error);
  }
);
