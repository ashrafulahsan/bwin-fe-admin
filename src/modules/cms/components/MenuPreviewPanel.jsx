"use client";

export default function MenuPreviewPanel({ previewTitle, previewSubtitle, previewTop, previewTree, health }) {
  return (
    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", padding: "16px 18px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)", marginBottom: 3 }}>{previewTitle}</div>
        <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginBottom: 14 }}>{previewSubtitle}</div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
          <div style={{ height: 36, background: "var(--navy-700)", display: "flex", alignItems: "center", gap: 14, padding: "0 12px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, color: "#FFFFFF", letterSpacing: "0.02em" }}>BWIN</span>
            {previewTop.map((p) => (
              <span key={p.id} style={{ fontSize: 11, color: "rgba(255,255,255,0.78)", whiteSpace: "nowrap" }}>
                {p.title}
              </span>
            ))}
          </div>
          <div style={{ padding: 12, background: "var(--surface-sunken)", display: "flex", flexDirection: "column", gap: 10 }}>
            {previewTree.map((p, i) => (
              <div key={i}>
                <div style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>{p.title}</div>
                {p.children.map((c, ci) => (
                  <div key={ci} style={{ fontSize: "var(--fs-caption)", color: "var(--text-secondary)", paddingLeft: c.pad }}>
                    {c.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>Health</div>
        {health.map((h) => (
          <div key={h.label} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", flex: 1 }}>{h.label}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: "var(--fw-semibold)", color: h.color }}>{h.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
