"use client";

// Shared data-table row action button — 30×30, 1px border-strong, radius-sm,
// Heroicons outline at 15px, `title` for the label. This is the project-wide
// convention documented for every admin table (see the Claude Design source's
// project notes, "same pattern as admin-panel-user-management.dc.html").
// Pass a colored <Icon .../> directly for a destructive action (e.g. delete) —
// only the icon is tinted red, not the button chrome, until hover.
export default function RowActionButton({ icon, title, onClick, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-card)",
        color: "var(--text-secondary)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? "var(--state-error-bg)" : "var(--surface-sunken)";
        if (!danger) e.currentTarget.style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--surface-card)";
        if (!danger) e.currentTarget.style.color = "var(--text-secondary)";
      }}
    >
      {icon}
    </button>
  );
}
