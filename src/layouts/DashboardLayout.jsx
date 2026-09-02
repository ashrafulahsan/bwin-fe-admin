"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useResponsiveSidebar } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { useCurrentUser } from "@/hooks/useApi";
import { TOKEN_STORAGE_KEY, isUsableToken } from "@/constants/constants";
import { ROUTES } from "@/config/routes";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  // `checked`/`hasToken` both start false on the server and on the client's
  // first paint (identical, so no hydration mismatch), and only flip once,
  // together, in the effect below — after mount, client-only. Deliberately
  // NOT derived via useSyncExternalStore: that resyncs to the real
  // localStorage value synchronously around hydration, but nothing here
  // needs to depend on exactly when relative to effects that happens, and a
  // plain mounted-flag keeps the redirect effect's ordering unambiguous.
  const [checked, setChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    // Seeding client-only state once on mount, not deriving render output.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasToken(isUsableToken(token));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked(true);
  }, []);

  // The actual authority on "am I logged in": GET /auth/me. apiClient silently
  // refreshes the access token on a 401 before this ever surfaces as an
  // error, so a page refresh never logs someone out by itself — only a
  // session the backend genuinely can't renew (expired refresh token, or
  // revoked via logout) ends up here as an error.
  const { data: currentUser, isSuccess, isError } = useCurrentUser(checked && hasToken);
  const notAuthenticated = checked && (!hasToken || isError);
  const sessionReady = checked && hasToken && isSuccess;

  useResponsiveSidebar();

  const isMobile = useAppStore((state) => state.isMobile);
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useAppStore((state) => state.setSidebarCollapsed);
  const darkMode = useSettingsStore((state) => state.darkMode);

  useEffect(() => {
    if (isSuccess && currentUser) setUser(currentUser);
  }, [isSuccess, currentUser, setUser]);

  // Redirect (client-only side effect, not state) once we know there's really no session.
  useEffect(() => {
    if (notAuthenticated) {
      logout();
      router.replace(ROUTES.LOGIN);
    }
  }, [notAuthenticated, logout, router]);

  // Show loading/redirect placeholder until the session is verified
  if (!sessionReady) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--surface-page)",
          fontSize: 14,
          color: "var(--gray-600)",
        }}
      >
        Loading…
      </div>
    );
  }

  const showScrim = isMobile && !isSidebarCollapsed;

  return (
    <div
      data-theme={darkMode ? "dark" : undefined}
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        fontFamily: "var(--font-body)",
        background: "var(--surface-page)",
        overflow: "hidden",
      }}
    >
      {showScrim && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 40 }}
        />
      )}

      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        <Header />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMobile ? "20px 16px 32px" : "28px 32px 48px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
