"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useResponsiveSidebar } from "@/hooks";

export default function DashboardLayout({ children }) {
  useResponsiveSidebar();

  const isMobile = useAppStore((state) => state.isMobile);
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useAppStore((state) => state.setSidebarCollapsed);
  const darkMode = useSettingsStore((state) => state.darkMode);

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
