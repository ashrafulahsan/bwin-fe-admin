"use client";

import { Button, Input, Select, Switch } from "@/components/ui";
import RichTextEditor from "@/components/forms/RichTextEditor";

const captionStyle = { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function AnnouncementFormModal({
  title,
  subtitle,
  form,
  onFieldChange,
  placementChoices,
  typeOptions,
  toneOptions,
  audienceOptions,
  formIsText,
  formIsImage,
  formHasImage,
  formNoImage,
  replaceWarning,
  formError,
  submitLabel,
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
        style={{ width: "100%", maxWidth: 740, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
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

        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ ...captionStyle, marginBottom: 8 }}>Where it shows</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {placementChoices.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={p.onClick}
                style={{ textAlign: "left", cursor: "pointer", padding: "12px 14px", border: `1px solid ${p.border}`, borderRadius: "var(--radius-sm)", background: p.bg, fontFamily: "var(--font-body)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = p.border)}
              >
                <div style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)", marginBottom: 3 }}>{p.label}</div>
                <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{p.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "18px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
            <span style={captionStyle}>Internal title</span>
            <Input value={form.title} onChange={(e) => onFieldChange("title", e.target.value)} placeholder="e.g. September cohorts are open" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Content type</span>
            <Select value={form.content_type} onChange={(e) => onFieldChange("content_type", e.target.value)} options={typeOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Colour</span>
            <Select value={form.tone} onChange={(e) => onFieldChange("tone", e.target.value)} options={toneOptions} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Audience</span>
            <Select value={form.audience} onChange={(e) => onFieldChange("audience", e.target.value)} options={audienceOptions} />
          </div>
        </div>

        {formIsText && (
          <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Message</span>
            <RichTextEditor key={form.id || "new"} value={form.body} onChange={(html) => onFieldChange("body", html)} placeholder="One clear sentence — what is happening and by when." />
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>Header and footer bars show one line — keep it short.</span>
          </div>
        )}

        {formIsImage && (
          <div style={{ padding: "14px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
              <span style={captionStyle}>Image URL</span>
              <Input value={form.image_url} onChange={(e) => onFieldChange("image_url", e.target.value)} placeholder="/media/announcements/august-audit.png" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
              <span style={captionStyle}>Alt text</span>
              <Input value={form.image_alt} onChange={(e) => onFieldChange("image_alt", e.target.value)} placeholder="What the image says, for screen readers" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <div style={{ border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-sunken)", minHeight: 110, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {formHasImage && (
                  <div
                    role="img"
                    aria-label={form.image_alt}
                    style={{ width: "100%", height: 180, backgroundImage: `url("${form.image_url.trim().replace(/"/g, "%22")}")`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                  />
                )}
                {formNoImage && (
                  <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", padding: 20, textAlign: "center" }}>
                    Paste an image URL above — 1200×400 works best for header and footer bars, 800×600 for pop ups.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: "14px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Button label (optional)</span>
            <Input value={form.cta_label} onChange={(e) => onFieldChange("cta_label", e.target.value)} placeholder="e.g. See courses" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Button link (optional)</span>
            <Input value={form.cta_url} onChange={(e) => onFieldChange("cta_url", e.target.value)} placeholder="/courses" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Starts</span>
            <Input type="datetime-local" value={form.starts_at} onChange={(e) => onFieldChange("starts_at", e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={captionStyle}>Ends</span>
            <Input type="datetime-local" value={form.ends_at} onChange={(e) => onFieldChange("ends_at", e.target.value)} />
          </div>
        </div>

        <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Switch checked={form.dismissible} onChange={(e) => onFieldChange("dismissible", e.target.checked)} />
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>Visitors can dismiss it</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Switch checked={form.is_active} onChange={(e) => onFieldChange("is_active", e.target.checked)} />
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>Activate on save</span>
          </div>
          {replaceWarning && (
            <div style={{ padding: "10px 14px", border: "1px solid var(--amber-500)", borderRadius: "var(--radius-sm)", background: "var(--amber-100)", fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>
              {replaceWarning}
            </div>
          )}
        </div>

        {formError && (
          <div style={{ margin: "14px 24px 0", padding: "10px 14px", border: "1px solid var(--red-500)", borderRadius: "var(--radius-sm)", background: "var(--red-100)", fontSize: "var(--fs-body-sm)", color: "var(--red-700)" }}>
            {formError}
          </div>
        )}

        <div style={{ padding: "18px 24px 20px", display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </div>
      </div>
    </div>
  );
}
