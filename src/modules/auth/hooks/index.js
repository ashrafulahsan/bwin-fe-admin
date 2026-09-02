"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "../services";
import { useAuthStore } from "@/store/authStore";
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, isUsableToken } from "@/constants/constants";

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      if (typeof window !== "undefined" && isUsableToken(data.accessToken)) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
        if (isUsableToken(data.refreshToken)) {
          window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refreshToken);
        }
      }
    },
  });
}
