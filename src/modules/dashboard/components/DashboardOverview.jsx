"use client";

import { useState } from "react";
import { Card, Badge, Button, Select, Icon } from "@/components/ui";
import { useSettingsStore } from "@/store/settingsStore";
import { useAppStore } from "@/store/appStore";
import { darkBadgeStyle } from "@/utils/badgeTone";
import { HERO_STATS, LMS_CARDS, CMS_CARDS, PENDING_CARDS, RANGE_OPTIONS } from "../constants/dashboardData";

// Tone -> [background, icon color], light/dark pairs — ported 1:1 from the
// admin-panel-dashboard.dc.html FAMILIES map in the Claude Design source.
const FAMILIES = {
  navy: { light: ["var(--navy-100)", "var(--navy-700)"], dark: ["var(--navy-600)", "var(--navy-100)"] },
  orange: { light: ["var(--orange-100)", "var(--orange-600)"], dark: ["var(--orange-900)", "var(--orange-200)"] },
  tan: { light: ["var(--tan-100)", "var(--tan-600)"], dark: ["var(--tan-800)", "var(--tan-100)"] },
  neutral: { light: ["var(--gray-100)", "var(--gray-600)"], dark: ["var(--gray-700)", "var(--gray-200)"] },
};

function familyStyle(tone, darkMode) {
  const [bg, color] = FAMILIES[tone][darkMode ? "dark" : "light"];
  return { bg, color };
}

function StatCard({ stat, isMobile }) {
  const cardStyle = isMobile
    ? {
        width: "100%",
        padding: "14px 16px",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-sunken)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        boxSizing: "border-box",
      }
    : {
        width: 172,
        flex: 1,
        minWidth: 160,
        padding: 16,
        borderRadius: "var(--radius-md)",
        background: "var(--surface-sunken)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxSizing: "border-box",
      };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              flex: "none",
              borderRadius: "var(--radius-sm)",
              background: stat.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={stat.icon} size={16} style={{ color: stat.color }} />
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontWeight: "var(--fw-medium)", fontSize: 18, color: "var(--text-primary)" }}>
            {stat.value}
          </div>
        </div>
        <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>{stat.label}</div>
      </div>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flex: "none",
          padding: "6px 10px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-strong)",
          background: "var(--surface-card)",
          color: "var(--text-primary)",
          fontSize: "var(--fs-caption)",
          fontWeight: "var(--fw-medium)",
          fontFamily: "var(--font-body)",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
      >
        <span>+</span>
        <span>{stat.action}</span>
      </button>
    </div>
  );
}

function DashboardCard({ card, darkMode }) {
  return (
    <Card hover>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-sm)",
              background: card.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={card.icon} size={18} style={{ color: card.color }} />
          </div>
          {card.badge && (
            <Badge tone={card.badgeTone} style={darkBadgeStyle(card.badgeTone, darkMode)}>
              {card.badge}
            </Badge>
          )}
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontWeight: "var(--fw-medium)", fontSize: 22, color: "var(--text-primary)", lineHeight: 1.15 }}>
            {card.value}
          </div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", marginTop: 2 }}>{card.label}</div>
        </div>
      </div>
    </Card>
  );
}

export default function DashboardOverview({ greetingName = "Admin", ctaLabel = "Add course", showPendingSection = true }) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const isMobile = useAppStore((state) => state.isMobile);
  const [filters, setFilters] = useState({ lms: "today", cms: "today" });

  const withStyle = (arr) => arr.map((c) => ({ ...c, ...familyStyle(c.tone, darkMode) }));
  const heroStats = withStyle(HERO_STATS);

  const sections = [
    { key: "lms", title: "LMS dashboard", cards: withStyle(LMS_CARDS), filterable: true, filterKey: "lms" },
    { key: "cms", title: "CMS dashboard", cards: withStyle(CMS_CARDS), filterable: true, filterKey: "cms" },
  ];
  if (showPendingSection) {
    sections.push({ key: "pending", title: "Pending actions", cards: withStyle(PENDING_CARDS), filterable: false });
  }

  const heroPadding = isMobile ? "4px" : "8px";
  const heroTitleSize = isMobile ? "24px" : "32px";
  const heroStatsWrapStyle = isMobile
    ? { display: "flex", gap: 10, flex: 1, minWidth: "100%", flexDirection: "column" }
    : { display: "flex", gap: 12, flex: "none" };
  const cardsMinWidth = isMobile ? "150px" : "216px";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: "var(--font-body)" }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap", padding: heroPadding }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h1
              style={{
                margin: "0 0 8px",
                fontFamily: "var(--font-display)",
                fontWeight: "var(--fw-bold)",
                fontSize: heroTitleSize,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Good morning, {greetingName}
            </h1>
            <p style={{ margin: "0 0 20px", fontSize: "var(--fs-body-md)", color: "var(--text-secondary)", maxWidth: 480 }}>
              Here&rsquo;s what&rsquo;s happening across the platform today — LMS, CMS, consultancy and automations at a
              glance.
            </p>
            <Button variant="accent" icon={<Icon name="plus" size={16} style={{ color: "var(--white)" }} />}>
              {ctaLabel}
            </Button>
          </div>
          <div style={heroStatsWrapStyle}>
            {heroStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </Card>

      {sections.map((section) => (
        <div key={section.key}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 20, color: "var(--text-primary)" }}>
              {section.title}
            </h2>
            <div style={{ flex: 1 }} />
            {section.filterable && (
              <Select
                value={filters[section.filterKey]}
                onChange={(e) => setFilters((f) => ({ ...f, [section.filterKey]: e.target.value }))}
                options={RANGE_OPTIONS}
                style={{ width: 150 }}
              />
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${cardsMinWidth}, 1fr))`, gap: 16 }}>
            {section.cards.map((card) => (
              <DashboardCard key={card.label} card={card} darkMode={darkMode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
