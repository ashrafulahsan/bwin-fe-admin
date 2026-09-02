"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { TOKEN_STORAGE_KEY, isUsableToken } from "@/constants/constants";

// Only restores the raw access token for anywhere that needs it immediately.
// The real, verified user (and whether the session is actually still valid)
// comes from GET /auth/me — see DashboardLayout, which is the actual gate on
// protected routes. Decoding the JWT for a fake "user" was dropped: the
// access token's payload is just {sub, jti, type, iat, exp}, never a name or
// email, so it could only ever produce a wrong-looking signed-in state.
export default function AuthProvider({ children }) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (isUsableToken(token)) setAccessToken(token);
  }, [setAccessToken]);

  return children;
}
