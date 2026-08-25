"use client";

export default function ListCategoryPane({ categories }) {
  return (
    <div style={{ minWidth: 0, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>Categories</div>
        <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2 }}>Every entry belongs to one category. Extra fields are defined per category.</div>
      </div>

      {categories.map((c) => (
        <div key={c.key} style={{ borderBottom: "1px solid var(--border)", background: c.bg, borderLeft: `3px solid ${c.stripe}` }}>
          <button
            type="button"
            onClick={c.onSelect}
            style={{ width: "100%", boxSizing: "border-box", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-body)", padding: "11px 14px 11px 13px", display: "flex", flexDirection: "column", gap: 3 }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: c.weight, color: "var(--text-primary)" }}>{c.name}</span>
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{c.countLabel}</span>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{c.metaLine}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
