import axios from "axios";
import { API_BASE_URL, TOKEN_STORAGE_KEY } from "@/constants/constants";

// Base HTTP client. Module-level services (e.g. modules/auth/services) should build on this
// rather than calling axios/fetch directly.
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// TODO: response interceptor for refresh-token handling on 401.
