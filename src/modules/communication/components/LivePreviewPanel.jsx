"use client";

import { Badge, Tag } from "@/components/ui";

function InlineBar({ live }) {
  return (
    <div style={{ background: live.bg, color: live.fg, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
      <div className="bwin-ann-one-line" style={{ fontSize: "var(--fs-body-sm)", flex: 1, minWidth: 0 }} dangerouslySetInnerHTML={{ __html: live.bodyHtml }} />
      {live.hasCta && (
        <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-semibold)", padding: "5px 10px", border: "1px solid currentColor", borderRadius: "var(--radius-sm)", whiteSpace: "nowrap" }}>
          {live.cta_label}
        </span>
      )}
      {live.dismissible && <span style={{ fontSize: 13, opacity: 0.8 }}>✕</span>}
    </div>
  );
}

export default function LivePreviewPanel({ live, liveMetrics }) {
  if (!live) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <Badge tone="success">Live</Badge>
        <Tag>{live.placementLabel}</Tag>
        <Tag>{live.typeLabel}</Tag>
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", fontWeight: "var(--fw-medium)" }}>{live.title}</span>
        <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{live.window}</span>
      </div>

      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--surface-sunken)" }}>
        <div style={{ height: 34, background: "var(--navy-700)", display: "flex", alignItems: "center", padding: "0 14px", gap: 16 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, color: "#FFFFFF", letterSpacing: "0.02em" }}>BWIN</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.72)" }}>Courses</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.72)" }}>Consultancy</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.72)" }}>Automation</span>
        </div>

        {live.isHeader && <InlineBar live={live} />}

        <div style={{ position: "relative", minHeight: 150, padding: "18px 14px", background: "var(--surface-card)" }}>
          <div style={{ height: 8, width: "38%", borderRadius: 999, background: "var(--gray-200)", marginBottom: 10 }} />
          <div style={{ height: 8, width: "60%", borderRadius: 999, background: "var(--gray-100)", marginBottom: 10 }} />
          <div style={{ height: 8, width: "48%", borderRadius: 999, background: "var(--gray-100)" }} />

          {live.isPopup && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(10,25,47,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
              <div style={{ width: "100%", maxWidth: 340, background: live.bg, color: live.fg, borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
                {live.isImage && (
                  <div style={{ height: 110, background: "var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--fs-caption)", color: "var(--text-muted)", textAlign: "center", padding: "0 12px" }}>
                    {live.imageLabel}
                  </div>
                )}
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, marginBottom: 6 }}>{live.title}</div>
                  {live.isText && (
                    <div className="bwin-ann-body" style={{ fontSize: 12, lineHeight: 1.55, opacity: 0.9 }} dangerouslySetInnerHTML={{ __html: live.bodyHtml }} />
                  )}
                  {live.hasCta && (
                    <div style={{ marginTop: 12, fontSize: 12, fontWeight: "var(--fw-semibold)", padding: "7px 12px", border: "1px solid currentColor", borderRadius: "var(--radius-sm)", display: "inline-block" }}>
                      {live.cta_label}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {live.isFooter && (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
              <InlineBar live={live} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 14, marginTop: 14 }}>
        {liveMetrics.map((m) => (
          <div key={m.label}>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontWeight: "var(--fw-medium)", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: "var(--fw-semibold)", color: "var(--text-primary)", lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
