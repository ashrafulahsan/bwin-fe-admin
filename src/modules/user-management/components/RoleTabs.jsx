"use client";

const TABS = [
  { key: "roles", label: "Roles" },
  { key: "permissions", label: "Permissions" },
  { key: "assign", label: "Assign permissions" },
];

export default function RoleTabs({ tab, view, onOpenTab, onOpenAssign }) {
  return (
    <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
      {TABS.map((t) => {
        const active = t.key === "assign" ? view === "assign" : view !== "assign" && tab === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => (t.key === "assign" ? onOpenAssign() : onOpenTab(t.key))}
            style={{
              padding: "12px 18px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-body-md)",
              fontWeight: active ? "var(--fw-medium)" : "var(--fw-regular)",
              color: active ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom: `2px solid ${active ? "var(--orange-500)" : "transparent"}`,
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
