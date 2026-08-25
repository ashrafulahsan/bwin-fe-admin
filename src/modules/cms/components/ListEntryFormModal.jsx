"use client";

import { Button, Input, Select, Switch, Textarea } from "@/components/ui";

const captionStyle = { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function ListEntryFormModal({
  title,
  subtitle,
  form,
  onTitle,
  onSlug,
  onCategory,
  categoryOptions,
  onLink,
  onDescription,
  onOrder,
  onStatus,
  statusOptions,
  hasCustomFields,
  customFieldsHeading,
  formFields,
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
        style={{ width: "100%", maxWidth: 680, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
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

        <div style={{ padding: "20px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
            <span style={captionStyle}>Title</span>
            <Input value={form.title} onChange={onTitle} placeholder="e.g. Automation clinic — Dhaka" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Slug</span>
            <Input value={form.slug} onChange={onSlug} placeholder="automation-clinic-dhaka" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Category</span>
            <Select value={form.category_id} onChange={onCategory} options={categoryOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
            <span style={captionStyle}>Link</span>
            <Input value={form.link} onChange={onLink} placeholder="/events/automation-clinic-dhaka" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
            <span style={captionStyle}>Description</span>
            <Textarea value={form.description} onChange={onDescription} rows={2} placeholder="Optional summary" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Order</span>
            <Input type="number" value={form.order} onChange={onOrder} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Status</span>
            <Select value={form.status} onChange={onStatus} options={statusOptions} />
          </div>
        </div>

        {hasCustomFields && (
          <div style={{ marginTop: 20, padding: "14px 24px 0", borderTop: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" }}>{customFieldsHeading}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginBottom: 12 }}>Defined for this category in the Fields tab.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
              {formFields.map((ff) => (
                <div key={ff.key} style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: ff.span }}>
                  <span style={captionStyle}>{ff.label}</span>
                  {ff.isInput && <Input type={ff.inputType} value={ff.value} onChange={ff.onChange} placeholder={ff.placeholder} />}
                  {ff.isTextarea && <Textarea value={ff.value} onChange={ff.onChange} rows={3} placeholder={ff.placeholder} />}
                  {ff.isSelect && <Select value={ff.value} onChange={ff.onChange} options={ff.options} />}
                  {ff.isBoolean && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, height: 40 }}>
                      <Switch checked={ff.checked} onChange={ff.onToggle} />
                      <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{ff.boolLabel}</span>
                    </div>
                  )}
                  {ff.hint && <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{ff.hint}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

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
