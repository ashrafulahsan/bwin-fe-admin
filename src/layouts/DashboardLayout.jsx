"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useResponsiveSidebar } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { TOKEN_STORAGE_KEY } from "@/constants/constants";
import { ROUTES } from "@/config/routes";

const noopSubscribe = () => () => {};
// Returning null keeps the server render and the client's pre-hydration render
// identical (no mismatch); React re-syncs to the real localStorage value right
// after hydration completes — no extra gating state, no manual setState-in-effect.
const getServerSnapshot = () => null;
const getClientTokenSnapshot = () => window.localStorage.getItem(TOKEN_STORAGE_KEY);

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useSyncExternalStore(noopSubscribe, getClientTokenSnapshot, getServerSnapshot);
  const isChecking = !token && !isAuthenticated;

  useResponsiveSidebar();

  const isMobile = useAppStore((state) => state.isMobile);
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useAppStore((state) => state.setSidebarCollapsed);
  const darkMode = useSettingsStore((state) => state.darkMode);

  // Redirect (client-only side effect, not state) once we know there's really no session.
  useEffect(() => {
    if (isChecking) router.replace(ROUTES.LOGIN);
  }, [isChecking, router]);

  // Show loading/redirect placeholder until the client-side auth check settles
  if (isChecking) {
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
