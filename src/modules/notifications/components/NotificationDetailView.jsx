"use client";

import { Badge, Button, Tag } from "@/components/ui";
import { useAppStore } from "@/store/appStore";

export default function NotificationDetailView({ detail, detailMetrics, detailFields, onClose }) {
  const isMobile = useAppStore((state) => state.isMobile);
  if (!detail) return null;

  return (
    <div>
      <button
        type="button"
        onClick={onClose}
        style={{ padding: 0, border: "none", background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", cursor: "pointer", marginBottom: 8 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        ← Back to notifications
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "22px" : "28px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            {detail.title}
          </h1>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
            <span style={{ fontFamily: "var(--font-mono)" }}>{detail.id}</span> · {detail.category} · created by {detail.created_by}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tag>{detail.originLabel}</Tag>
          <Badge tone={detail.statusTone}>{detail.statusLabel}</Badge>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.7fr) minmax(0,1fr)", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>
              Message
            </div>
            <div
              className="bwin-notif-body"
              style={{ padding: 20, fontSize: "var(--fs-body-md)", lineHeight: 1.65, color: "var(--text-secondary)" }}
              dangerouslySetInnerHTML={{ __html: detail.body }}
            />
            {detail.hasAction && (
              <div style={{ padding: "0 20px 20px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <Button>{detail.action_label}</Button>
                <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{detail.action_url}</span>
              </div>
            )}
          </div>

          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>
              Delivery
            </div>
            <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16 }}>
              {detailMetrics.map((m) => (
                <div key={m.label}>
                  <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontWeight: "var(--fw-medium)", marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: "var(--fw-semibold)", color: "var(--text-primary)", lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 4 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden", minWidth: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>
            Details
          </div>
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {detailFields.map((f) => (
              <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>{f.label}</span>
                <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: f.font, overflowWrap: "anywhere" }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
