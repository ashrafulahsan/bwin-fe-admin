"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Icon } from "@/components/ui";
import { getVisibleSidebarItems } from "@/config/sidebar";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { ROUTES } from "@/config/routes";

// Nav color palette for the active/hover states — ported 1:1 from the
// Admin Panel.dc.html `navPal` map in the Claude Design source.
function getNavPalette(darkMode) {
  return darkMode
    ? {
        activeBg: "rgba(255,255,255,0.12)",
        hoverBg: "rgba(255,255,255,0.08)",
        activeColor: "var(--white)",
        color: "rgba(255,255,255,0.75)",
        childActiveBg: "rgba(255,255,255,0.1)",
        childHoverBg: "rgba(255,255,255,0.08)",
        childActiveColor: "var(--white)",
        childColor: "rgba(255,255,255,0.65)",
        logoutColor: "rgba(255,255,255,0.7)",
        logoutHoverColor: "var(--white)",
        logoutHoverBg: "rgba(255,255,255,0.08)",
      }
    : {
        activeBg: "var(--surface-sunken)",
        hoverBg: "var(--surface-sunken)",
        activeColor: "var(--text-primary)",
        color: "var(--text-secondary)",
        childActiveBg: "var(--surface-sunken)",
        childHoverBg: "var(--surface-sunken)",
        childActiveColor: "var(--text-primary)",
        childColor: "var(--text-muted)",
        logoutColor: "var(--text-secondary)",
        logoutHoverColor: "var(--state-error)",
        logoutHoverBg: "var(--state-error-bg)",
      };
}

function NavItem({ item, pathname, expanded, navPal, open, onToggleGroup, onNavigate }) {
  const hasChildren = !!item.children;
  const activeSelf = !hasChildren && pathname === item.href;
  const activeChild = hasChildren && item.children.some((c) => pathname === c.href);
  const isActive = activeSelf || activeChild;
  const color = isActive ? navPal.activeColor : navPal.color;
  const bg = isActive ? navPal.activeBg : "transparent";
  const weight = isActive ? "var(--fw-medium)" : "var(--fw-regular)";

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: "var(--radius-sm)",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    background: bg,
    color,
    fontSize: "var(--fs-body-md)",
    fontWeight: weight,
    fontFamily: "var(--font-body)",
    transition: "background 150ms ease-out",
    textDecoration: "none",
  };

  const inner = (
    <>
      <span style={{ display: "inline-flex" }}>
        <Icon name={item.icon} size={20} style={{ color }} />
      </span>
      {expanded && (
        <>
          <span style={{ flex: 1 }}>{item.label}</span>
          {hasChildren && (
            <span style={{ display: "inline-flex" }}>
              <Icon name={open ? "chevron-up" : "chevron-down"} size={16} style={{ color }} />
            </span>
          )}
        </>
      )}
    </>
  );

  const hoverHandlers = {
    onMouseEnter: (e) => {
      if (!isActive) e.currentTarget.style.background = navPal.hoverBg;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = bg;
    },
  };

  return (
    <div>
      {hasChildren ? (
        <button type="button" title={item.label} style={buttonStyle} onClick={() => onToggleGroup(item.key)} {...hoverHandlers}>
          {inner}
        </button>
      ) : (
        <Link href={item.href} title={item.label} style={buttonStyle} onClick={onNavigate} {...hoverHandlers}>
          {inner}
        </Link>
      )}

      {hasChildren && open && expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "2px 0 4px 34px" }}>
          {item.children.map((child) => {
            const childActive = pathname === child.href;
            const childColor = childActive ? navPal.childActiveColor : navPal.childColor;
            const childBg = childActive ? navPal.childActiveBg : "transparent";
            return (
              <Link
                key={child.key}
                href={child.href}
                onClick={onNavigate}
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  background: childBg,
                  color: childColor,
                  fontSize: "var(--fs-body-sm)",
                  fontWeight: childActive ? "var(--fw-medium)" : "var(--fw-regular)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = navPal.childHoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = childBg)}
              >
                – {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const isMobile = useAppStore((state) => state.isMobile);
  const openGroupKey = useAppStore((state) => state.openGroupKey);
  const toggleGroup = useAppStore((state) => state.toggleGroup);
  const setOpenGroupKey = useAppStore((state) => state.setOpenGroupKey);
  const setSidebarCollapsed = useAppStore((state) => state.setSidebarCollapsed);

  const darkMode = useSettingsStore((state) => state.darkMode);
  const role = useAuthStore((state) => state.user?.role ?? null);
  const logoutMutation = useLogout();
  const { showSuccess } = useToast();

  const items = useMemo(() => getVisibleSidebarItems(role), [role]);
  const navPal = getNavPalette(darkMode);
  const expanded = !isCollapsed;

  // Auto-open the group containing the current route on first load / route change.
  useEffect(() => {
    const activeGroup = items.find((item) => item.children?.some((c) => pathname === c.href));
    if (activeGroup && activeGroup.key !== openGroupKey) setOpenGroupKey(activeGroup.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, items]);

  const handleToggleGroup = (key) => toggleGroup(key);
  const handleNavigate = () => {
    if (isMobile) setSidebarCollapsed(true);
  };
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        showSuccess("You have been logged out.");
        router.push(ROUTES.LOGIN);
      },
    });
  };

  const navStyle = isMobile
    ? {
        width: 264,
        flex: "none",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        zIndex: 50,
        background: darkMode ? "var(--navy-800)" : "var(--surface-card)",
        borderRight: darkMode ? "1px solid transparent" : "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        boxShadow: "var(--shadow-lg)",
        transform: `translateX(${isCollapsed ? "-100%" : "0"})`,
        transition: "transform 200ms ease-out",
      }
    : {
        width: isCollapsed ? 76 : 264,
        flex: "none",
        background: darkMode ? "var(--navy-800)" : "var(--surface-card)",
        borderRight: darkMode ? "1px solid transparent" : "1px solid var(--border)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        transition: "width 150ms ease-out, background 150ms ease-out",
      };

  return (
    <nav style={navStyle}>
      <div style={{ padding: "20px 20px 20px", display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "flex-start" }}>
        <div style={{ background: "var(--white)", borderRadius: "var(--radius-md)", padding: isCollapsed ? 6 : "8px 14px", display: "inline-flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {expanded ? (
            <img src="/assets/logo/bwin-logo.png" alt="BWIN Consultants" style={{ height: 32, width: "auto", display: "block" }} />
          ) : (
            <img src="/assets/logo/bwin-icon.png" alt="BWIN Consultants" style={{ height: 24, width: "auto", display: "block" }} />
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            pathname={pathname}
            expanded={expanded}
            navPal={navPal}
            open={openGroupKey === item.key}
            onToggleGroup={handleToggleGroup}
            onNavigate={handleNavigate}
          />
        ))}
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "var(--border)"}` }}>
        <button
          type="button"
          title="Log out"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px",
            borderRadius: "var(--radius-sm)",
            border: "none",
            cursor: logoutMutation.isPending ? "not-allowed" : "pointer",
            opacity: logoutMutation.isPending ? 0.6 : 1,
            textAlign: "left",
            background: "transparent",
            color: navPal.logoutColor,
            fontSize: "var(--fs-body-md)",
            fontFamily: "var(--font-body)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = navPal.logoutHoverBg;
            e.currentTarget.style.color = navPal.logoutHoverColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = navPal.logoutColor;
          }}
        >
          <span style={{ display: "inline-flex" }}>
            <Icon name="arrow-left-on-rectangle" size={20} style={{ color: navPal.logoutColor }} />
          </span>
          {expanded && <span>{logoutMutation.isPending ? "Logging out…" : "Log out"}</span>}
        </button>
      </div>
    </nav>
  );
}
