"use client";

import { Button, Input, Select, Switch } from "@/components/ui";

const captionStyle = { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function ListFieldFormModal({
  title,
  subtitle,
  form,
  onName,
  onType,
  fieldTypeOptions,
  onCategory,
  categoryOptions,
  onStatus,
  statusOptions,
  fieldNeedsOptions,
  onOptions,
  onRequired,
  formError,
  meta,
  saveLabel,
  onClose,
  onSubmit,
}) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 560, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
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

        <div style={{ padding: "20px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Field name</span>
            <Input value={form.field_name} onChange={onName} placeholder="e.g. Event organizer" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Field type</span>
            <Select value={form.field_type} onChange={onType} options={fieldTypeOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Category</span>
            <Select value={form.category_id} onChange={onCategory} options={categoryOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Status</span>
            <Select value={form.status} onChange={onStatus} options={statusOptions} />
          </div>
          {fieldNeedsOptions && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
              <span style={captionStyle}>Choices</span>
              <Input value={form.optionsText} onChange={onOptions} placeholder="Courses, Billing, Consultancy" />
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>Comma separated.</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, gridColumn: "1/-1", padding: "2px 0 4px" }}>
            <Switch checked={form.field_requiredness} onChange={onRequired} />
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>Required on every entry in this category</span>
          </div>
        </div>

        {formError && (
          <div style={{ margin: "16px 24px 0", padding: "10px 12px", border: "1px solid var(--red-500)", borderRadius: "var(--radius-sm)", background: "var(--red-100)", fontSize: "var(--fs-body-sm)", color: "var(--red-700)" }}>
            {formError}
          </div>
        )}

        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{meta}</div>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{saveLabel}</Button>
        </div>
      </div>
    </div>
  );
}
