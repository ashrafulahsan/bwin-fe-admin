"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon, IconButton, Input, Avatar } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { ROUTES } from "@/config/routes";
import { NOTIFICATIONS } from "@/modules/notifications/constants/notifications.mock";

const DOT_COLOR = {
  urgent: "var(--state-error)",
  high: "var(--orange-500)",
};

export default function Header() {
  const router = useRouter();
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const isMobile = useAppStore((state) => state.isMobile);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const notificationsOpen = useAppStore((state) => state.notificationsOpen);
  const toggleNotifications = useAppStore((state) => state.toggleNotifications);
  const profileOpen = useAppStore((state) => state.profileOpen);
  const toggleProfile = useAppStore((state) => state.toggleProfile);
  const closePopovers = useAppStore((state) => state.closePopovers);

  const darkMode = useSettingsStore((state) => state.darkMode);
  const toggleDarkMode = useSettingsStore((state) => state.toggleDarkMode);

  const greetingName = useAuthStore((state) => state.user?.full_name ?? "Admin");
  const logoutMutation = useLogout();
  const { showSuccess } = useToast();

  useEffect(() => {
    if (!notificationsOpen && !profileOpen) return;
    const onPointerDown = (e) => {
      if (notifRef.current?.contains(e.target)) return;
      if (profileRef.current?.contains(e.target)) return;
      closePopovers();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [notificationsOpen, profileOpen, closePopovers]);

  const sentNotifications = NOTIFICATIONS.filter((n) => n.status === "sent");
  const hasUnread = sentNotifications.length > 0;
  const notifItems = sentNotifications.slice(0, 5);

  const handleLogout = () => {
    closePopovers();
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        showSuccess("You have been logged out.");
        router.push(ROUTES.LOGIN);
      },
    });
  };

  return (
    <header
      style={{
        flex: "none",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: isMobile ? "12px 16px" : "16px 32px",
        background: "var(--surface-card)",
        borderBottom: "1px solid var(--border)",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 10,
      }}
    >
      <IconButton variant="ghost" ariaLabel="Toggle menu" icon={<Icon name="bars-3" size={20} />} onClick={toggleSidebar} />

      <div style={{ width: isMobile ? "100%" : 280, maxWidth: 340, flex: 1 }}>
        <Input placeholder="Search here..." icon={<Icon name="search" size={16} />} />
      </div>

      <div style={{ flex: 1 }} />

      <IconButton
        variant="ghost"
        ariaLabel="Toggle theme"
        icon={<Icon name={darkMode ? "moon" : "sun"} size={20} />}
        onClick={toggleDarkMode}
      />

      <div ref={notifRef} style={{ position: "relative" }}>
        <IconButton variant="ghost" ariaLabel="Notifications" icon={<Icon name="bell" size={20} />} onClick={toggleNotifications} />
        {hasUnread && (
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--orange-500)",
              border: "2px solid var(--surface-card)",
            }}
          />
        )}
        {notificationsOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 46,
              right: 0,
              width: 360,
              maxWidth: "calc(100vw - 32px)",
              background: "var(--surface-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              zIndex: 20,
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>
                Notifications
              </span>
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {sentNotifications.length} new
              </span>
            </div>
            <div style={{ maxHeight: 380, overflowY: "auto" }}>
              {notifItems.map((n, i) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    background: i < 2 ? "var(--surface-sunken)" : "transparent",
                  }}
                >
                  <span
                    style={{
                      flex: "none",
                      marginTop: 5,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: DOT_COLOR[n.priority] || "var(--gray-300)",
                    }}
                  />
                  <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                    <span
                      style={{
                        fontSize: "var(--fs-body-sm)",
                        fontWeight: i < 2 ? "var(--fw-semibold)" : "var(--fw-regular)",
                        color: "var(--text-primary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {n.title}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--fs-caption)",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {n.preview}
                    </span>
                    <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{n.sent_at}</span>
                  </div>
                </div>
              ))}
              {notifItems.length === 0 && (
                <div style={{ padding: "28px 16px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
                  Nothing new right now.
                </div>
              )}
            </div>
            <button
              onClick={() => {
                closePopovers();
                router.push(ROUTES.NOTIFICATIONS);
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                borderTop: "1px solid var(--border)",
                background: "transparent",
                color: "var(--orange-600)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-body-sm)",
                fontWeight: "var(--fw-medium)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              View more
            </button>
          </div>
        )}
      </div>

      <div ref={profileRef} style={{ position: "relative" }}>
        <button
          onClick={toggleProfile}
          style={{ display: "block", padding: 0, border: "none", background: "transparent", cursor: "pointer", borderRadius: "50%" }}
        >
          <Avatar name={greetingName} size={36} style={darkMode ? { background: "var(--navy-600)", color: "var(--navy-100)" } : undefined} />
        </button>
        {profileOpen && (
          <div
            style={{
              position: "absolute",
              top: 46,
              right: 0,
              width: 200,
              background: "var(--surface-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-md)",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              zIndex: 20,
            }}
          >
            <div style={{ padding: "8px 10px 10px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
              <div style={{ fontSize: "var(--fs-body-md)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>{greetingName}</div>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>Super admin</div>
            </div>
            <button
              onClick={() => {
                closePopovers();
                router.push(ROUTES.PROFILE);
              }}
              style={menuButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ display: "inline-flex" }}>
                <Icon name="user" size={16} />
              </span>
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                closePopovers();
                router.push(ROUTES.SETTINGS);
              }}
              style={menuButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ display: "inline-flex" }}>
                <Icon name="cog-6-tooth" size={16} />
              </span>
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              style={{ ...menuButtonStyle, color: "var(--state-error)", opacity: logoutMutation.isPending ? 0.6 : 1, cursor: logoutMutation.isPending ? "not-allowed" : "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--state-error-bg)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ display: "inline-flex" }}>
                <Icon name="arrow-left-on-rectangle" size={16} style={{ color: "var(--state-error)" }} />
              </span>
              <span>{logoutMutation.isPending ? "Logging out…" : "Log out"}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

const menuButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  border: "none",
  background: "transparent",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  textAlign: "left",
  color: "var(--text-primary)",
  fontSize: "var(--fs-body-sm)",
  fontFamily: "var(--font-body)",
};
