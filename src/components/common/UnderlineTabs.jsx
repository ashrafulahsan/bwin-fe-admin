"use client";

// Orange-underline tab row used above a filtered table (notifications'
// origin tabs, newsletter's Campaigns/Subscribers tabs). `tabs` is
// [{ key, label, active, onClick }].
export default function UnderlineTabs({ tabs }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", borderBottom: "1px solid var(--border)" }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={tab.onClick}
          style={{
            padding: "10px 14px",
            border: "none",
            borderBottom: `2px solid ${tab.active ? "var(--orange-500)" : "transparent"}`,
            background: "transparent",
            color: tab.active ? "var(--text-primary)" : "var(--text-muted)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body-sm)",
            fontWeight: "var(--fw-medium)",
            cursor: "pointer",
            marginBottom: -1,
          }}
          onMouseEnter={(e) => {
            if (!tab.active) e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            if (!tab.active) e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
