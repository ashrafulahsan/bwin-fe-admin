"use client";

import { Button, Input, Select } from "@/components/ui";
import { RichTextEditor } from "@/components/forms";

const fieldLabelStyle = { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function NotificationCreateModal({
  form,
  onFieldChange,
  audienceOptions,
  channelOptions,
  formCategoryOptions,
  priorityOptions,
  formError,
  submitLabel,
  onClose,
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
        style={{ width: "100%", maxWidth: 720, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>New notification</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>Sent from BWIN Consultants · appears in the recipient's notification tray</div>
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
            <span style={fieldLabelStyle}>Title</span>
            <Input value={form.title} onChange={(e) => onFieldChange("title", e.target.value)} placeholder="e.g. September cohort schedule is live" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Send to</span>
            <Select value={form.audience} onChange={(e) => onFieldChange("audience", e.target.value)} options={audienceOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Category</span>
            <Select value={form.category} onChange={(e) => onFieldChange("category", e.target.value)} options={formCategoryOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Channel</span>
            <Select value={form.channel} onChange={(e) => onFieldChange("channel", e.target.value)} options={channelOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Priority</span>
            <Select value={form.priority} onChange={(e) => onFieldChange("priority", e.target.value)} options={priorityOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
            <span style={fieldLabelStyle}>Message</span>
            <RichTextEditor value={form.body} onChange={(html) => onFieldChange("body", html)} placeholder="What changed, what it means for them, and what to do next." />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Button label (optional)</span>
            <Input value={form.action_label} onChange={(e) => onFieldChange("action_label", e.target.value)} placeholder="e.g. View schedule" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Button link (optional)</span>
            <Input value={form.action_url} onChange={(e) => onFieldChange("action_url", e.target.value)} placeholder="/courses/schedule" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
            <span style={fieldLabelStyle}>Schedule for later (optional)</span>
            <Input type="datetime-local" value={form.scheduled_at} onChange={(e) => onFieldChange("scheduled_at", e.target.value)} />
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>Leave empty to send as soon as you save.</span>
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
          <Button variant="secondary" onClick={onSaveDraft}>
            Save as draft
          </Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </div>
      </div>
    </div>
  );
}
