"use client";

import { Button } from "@/components/ui";

const BODY_FONT = "var(--font-body)";
const MONO_FONT = "var(--font-mono)";

const json = (v) => (v === null || v === undefined ? "—" : JSON.stringify(v, null, 2));

function buildFields(log) {
  return [
    { label: "user_name", value: log.user_name, font: BODY_FONT },
    { label: "role_name", value: log.role_name || "—", font: BODY_FONT },
    { label: "user_id", value: log.user_id || "—", font: MONO_FONT },
    { label: "action", value: log.action, font: BODY_FONT },
    { label: "module", value: log.module, font: BODY_FONT },
    { label: "status", value: log.status, font: BODY_FONT },
    { label: "entity_type", value: log.entity_type || "—", font: BODY_FONT },
    { label: "entity_id", value: log.entity_id || "—", font: MONO_FONT },
    { label: "description", value: log.description, font: BODY_FONT },
    { label: "ip_address", value: log.ip_address || "—", font: MONO_FONT },
    { label: "request_method", value: log.request_method || "—", font: MONO_FONT },
    { label: "request_url", value: log.request_url || "—", font: MONO_FONT },
    { label: "user_agent", value: log.user_agent || "—", font: MONO_FONT },
    { label: "created_at", value: log.created_at, font: MONO_FONT },
  ];
}

export default function ActivityLogDetailModal({ log, onClose }) {
  if (!log) return null;
  const fields = buildFields(log);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,25,47,0.45)",
        zIndex: 60,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 20px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 720, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>Activity detail</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", overflowWrap: "anywhere" }}>{log.id}</div>
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, flex: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-muted)", fontSize: 16, lineHeight: 1, cursor: "pointer" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface-sunken)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
          {fields.map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>{f.label}</span>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: f.font, overflowWrap: "anywhere" }}>{f.value}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: "0 24px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <div>
            <div style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", marginBottom: 6 }}>old_values</div>
            <pre
              style={{
                margin: 0,
                padding: 12,
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-sunken)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {json(log.old_values)}
            </pre>
          </div>
          <div>
            <div style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", marginBottom: 6 }}>new_values</div>
            <pre
              style={{
                margin: 0,
                padding: 12,
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-sunken)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {json(log.new_values)}
            </pre>
          </div>
        </div>

        <div style={{ padding: "14px 24px 20px", display: "flex", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
