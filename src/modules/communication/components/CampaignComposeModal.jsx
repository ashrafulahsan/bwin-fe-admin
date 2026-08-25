"use client";

import { Button, Input, Select } from "@/components/ui";
import { RichTextEditor } from "@/components/forms";

const fieldLabelStyle = { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function CampaignComposeModal({
  title,
  subtitle,
  form,
  onFieldChange,
  segmentOptions,
  segmentReach,
  formError,
  submitLabel,
  onClose,
  onSendTest,
  onSaveDraft,
  onSubmit,
}) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 760, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>{title}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{subtitle}</div>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
            <span style={fieldLabelStyle}>Subject line</span>
            <Input value={form.subject} onChange={(e) => onFieldChange("subject", e.target.value)} placeholder="e.g. September cohorts are open" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
            <span style={fieldLabelStyle}>Preheader</span>
            <Input value={form.preheader} onChange={(e) => onFieldChange("preheader", e.target.value)} placeholder="The line inboxes show after the subject" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Send to segment</span>
            <Select value={form.segment} onChange={(e) => onFieldChange("segment", e.target.value)} options={segmentOptions} />
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{segmentReach}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>From name</span>
            <Input value={form.from_name} onChange={(e) => onFieldChange("from_name", e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>From email</span>
            <Input value={form.from_email} onChange={(e) => onFieldChange("from_email", e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Reply-to</span>
            <Input value={form.reply_to} onChange={(e) => onFieldChange("reply_to", e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
            <span style={fieldLabelStyle}>Email content</span>
            <RichTextEditor value={form.body} onChange={(html) => onFieldChange("body", html)} placeholder="Write the email the way you would explain it to one client." />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
            <span style={fieldLabelStyle}>Schedule for later (optional)</span>
            <Input type="datetime-local" value={form.scheduled_at} onChange={(e) => onFieldChange("scheduled_at", e.target.value)} />
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>Leave empty to send as soon as you confirm.</span>
          </div>
        </div>

        {formError && (
          <div style={{ margin: "0 24px 12px", padding: "10px 14px", border: "1px solid var(--red-500)", borderRadius: "var(--radius-sm)", background: "var(--red-100)", fontSize: "var(--fs-body-sm)", color: "var(--red-700)" }}>
            {formError}
          </div>
        )}

        <div style={{ padding: "4px 24px 20px", display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onSendTest}>
            Send test to me
          </Button>
          <Button variant="secondary" onClick={onSaveDraft}>
            Save as draft
          </Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </div>
      </div>
    </div>
  );
}
