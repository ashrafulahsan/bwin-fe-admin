"use client";

import { Button, Input, Select, Textarea } from "@/components/ui";

const captionStyle = { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function MenuFormModal({
  title,
  subtitle,
  form,
  onFieldChange,
  categoryOptions,
  parentOptions,
  clearImage,
  hasImage,
  imagePreviewCss,
  imagePlaceholderLabel,
  formError,
  submitLabel,
  submitting,
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
        style={{ width: "100%", maxWidth: 640, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
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
            <Input value={form.title} onChange={(e) => onFieldChange("title", e.target.value)} placeholder="e.g. Live classes" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Menu category</span>
            <Select value={form.menu_category_id} onChange={(e) => onFieldChange("menu_category_id", e.target.value)} options={categoryOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Parent (creates a submenu)</span>
            <Select value={form.parent_id} onChange={(e) => onFieldChange("parent_id", e.target.value)} options={parentOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
            <span style={captionStyle}>Link</span>
            <Input value={form.link} onChange={(e) => onFieldChange("link", e.target.value)} placeholder="/skill-development/classes" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Icon name</span>
            <Input value={form.icon} onChange={(e) => onFieldChange("icon", e.target.value)} placeholder="academic-cap" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Order within parent</span>
            <Input type="number" value={form.order} onChange={(e) => onFieldChange("order", e.target.value)} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
            <span style={captionStyle}>Image URL (optional)</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  flex: "none",
                  width: 76,
                  height: 56,
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xs)",
                  backgroundColor: "var(--surface-sunken)",
                  backgroundImage: imagePreviewCss,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "var(--text-muted)",
                }}
              >
                {imagePlaceholderLabel}
              </div>
              <div style={{ minWidth: 0, flex: 1, display: "flex", gap: 8 }}>
                <Input
                  style={{ flex: 1 }}
                  value={form.image}
                  onChange={(e) => onFieldChange("image", e.target.value)}
                  placeholder="https://cdn.example.com/icons/services.svg"
                />
                {hasImage && (
                  <button
                    type="button"
                    onClick={clearImage}
                    style={{ flex: "none", padding: "8px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--red-700)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--red-100)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
            <span style={captionStyle}>Description (optional)</span>
            <Textarea value={form.description} onChange={(e) => onFieldChange("description", e.target.value)} rows={3} placeholder="Shown as helper text in dropdowns" />
          </div>
        </div>

        {formError && (
          <div style={{ margin: "14px 24px 0", padding: "10px 14px", border: "1px solid var(--red-500)", borderRadius: "var(--radius-sm)", background: "var(--red-100)", fontSize: "var(--fs-body-sm)", color: "var(--red-700)" }}>
            {formError}
          </div>
        )}

        <div style={{ padding: "18px 24px 20px", display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? "Saving…" : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
