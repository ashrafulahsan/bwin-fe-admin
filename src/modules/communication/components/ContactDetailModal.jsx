"use client";

import { Avatar, Badge, Button, Select, Textarea } from "@/components/ui";

const BODY_FONT = "var(--font-body)";
const MONO_FONT = "var(--font-mono)";

export default function ContactDetailModal({
  draft,
  statusLabels,
  statusTones,
  statusChangeOptions,
  assigneeOptions,
  onFieldChange,
  onClose,
  onReplyByEmail,
  onSave,
}) {
  if (!draft) return null;

  const statusLabel = statusLabels[draft.status] || draft.status;
  const statusTone = statusTones[draft.status] || "neutral";

  const detailFields = [
    { label: "Email address", value: draft.email, font: BODY_FONT },
    { label: "Phone", value: draft.phone || "—", font: MONO_FONT },
    { label: "Interested in", value: draft.interested_in, font: BODY_FONT },
    { label: "Submitted from", value: draft.source_page, font: MONO_FONT },
    { label: "IP address", value: draft.ip_address || "—", font: MONO_FONT },
    { label: "Last updated", value: draft.updated_at, font: MONO_FONT },
  ];

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 720, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={draft.full_name} size={40} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>{draft.full_name}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {draft.id} · {draft.created_at}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <Badge tone={statusTone}>{statusLabel}</Badge>
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

        <div style={{ padding: "20px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px 20px" }}>
          {detailFields.map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>{f.label}</span>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: f.font, overflowWrap: "anywhere" }}>{f.value}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: "18px 24px 0" }}>
          <div style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", marginBottom: 6 }}>Message</div>
          <div style={{ padding: "14px 16px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-sunken)", fontSize: "var(--fs-body-md)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {draft.message}
          </div>
        </div>

        <div style={{ padding: "18px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>Change status</span>
            <Select value={draft.status} onChange={(e) => onFieldChange("status", e.target.value)} options={statusChangeOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>Assigned to</span>
            <Select value={draft.assigned_to || ""} onChange={(e) => onFieldChange("assigned_to", e.target.value)} options={assigneeOptions} />
          </div>
        </div>

        <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>Internal note</span>
          <Textarea
            value={draft.internal_note || ""}
            onChange={(e) => onFieldChange("internal_note", e.target.value)}
            rows={3}
            placeholder="Visible to your team only — what happens next?"
          />
        </div>

        <div style={{ padding: "18px 24px 20px", display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={onReplyByEmail}>
            Reply by email
          </Button>
          <Button onClick={onSave}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
