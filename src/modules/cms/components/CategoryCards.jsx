"use client";

export default function CategoryCards({ categories }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 16 }}>
      {categories.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.onSelect}
          style={{ textAlign: "left", cursor: "pointer", fontFamily: "var(--font-body)", padding: "13px 15px", border: `1px solid ${c.border}`, borderRadius: "var(--radius-sm)", background: c.bg, display: "flex", flexDirection: "column", gap: 4 }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = c.border)}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: "var(--fs-body-md)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>{c.name}</span>
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{c.countLabel}</span>
          </div>
          <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", lineHeight: 1.5 }}>{c.hint}</div>
        </button>
      ))}
    </div>
  );
}
