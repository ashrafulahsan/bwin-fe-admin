"use client";

export default function SettingsGroupTabs({ tabs, direction }) {
  return (
    <div style={{ display: "flex", flexDirection: direction, gap: 4, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", padding: 8, overflowX: "auto" }}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={t.onClick}
          style={{
            textAlign: "left",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            border: "none",
            borderRadius: "var(--radius-sm)",
            background: t.active ? "var(--surface-sunken)" : "transparent",
            color: t.active ? "var(--text-primary)" : "var(--text-secondary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body-sm)",
            fontWeight: t.active ? "var(--fw-medium)" : "var(--fw-regular)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => !t.active && (e.currentTarget.style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => !t.active && (e.currentTarget.style.background = "transparent")}
        >
          <span>{t.label}</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{t.count}</span>
        </button>
      ))}
    </div>
  );
}
