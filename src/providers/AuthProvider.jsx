"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from "@/constants/constants";

export default function AuthProvider({ children }) {
  const { setAccessToken, setUser } = useAuthStore();

  useEffect(() => {
    // Hydrate auth state from localStorage on mount
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        setAccessToken(token);
        // Optionally decode JWT to get user info
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser(payload);
        } catch (e) {
          console.warn("Failed to decode token:", e);
        }
      }
    }
  }, [setAccessToken, setUser]);

  return children;
}
