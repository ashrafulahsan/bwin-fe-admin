"use client";

// Small stat-card row used at the top of most admin list pages. Plain
// (label + mono value) by default. Make cards clickable filter shortcuts
// either way:
//   - simple case: pass `onSelect` + `activeKey`, and give each stat a `key`
//     (contact-form submissions' single status filter).
//   - custom case: give each stat its own `onClick` + `active` directly, for
//     cards that drive different pieces of state (notifications' origin tabs
//     + a separate "Scheduled" toggle). Per-stat `onClick`/`active` always
//     wins over the generic `onSelect`/`activeKey` when both are present.
// Either way the active card gets an orange border and the row becomes buttons.
export default function StatCardsGrid({ stats, onSelect, activeKey }) {
  const clickable = typeof onSelect === "function" || stats.some((st) => typeof st.onClick === "function");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
      {stats.map((st) => {
        const active = clickable && (st.active !== undefined ? st.active : st.key === activeKey);
        const baseStyle = {
          background: "var(--surface-card)",
          border: `1px solid ${clickable ? (active ? "var(--orange-500)" : "var(--border)") : "var(--border)"}`,
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-sm)",
          padding: "14px 16px",
        };

        if (!clickable) {
          return (
            <div key={st.label} style={baseStyle}>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{st.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: "var(--fw-semibold)", color: "var(--text-primary)", marginTop: 4 }}>{st.value}</div>
              {st.sub !== undefined && (
                <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 5 }}>{st.sub}</div>
              )}
            </div>
          );
        }

        return (
          <button
            key={st.key}
            type="button"
            onClick={st.onClick || (() => onSelect(st.key))}
            style={{ ...baseStyle, textAlign: "left", cursor: "pointer", fontFamily: "var(--font-body)" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
          >
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontWeight: "var(--fw-medium)", marginBottom: 6 }}>{st.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: "var(--fw-semibold)", color: "var(--text-primary)", lineHeight: 1 }}>{st.value}</div>
            {st.sub !== undefined && (
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 5 }}>{st.sub}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
