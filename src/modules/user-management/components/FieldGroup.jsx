"use client";

import { Input, Select, Textarea } from "@/components/ui";

const legendStyle = { padding: "0 8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" };
const fieldLabelStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" };
const hintStyle = { fontSize: "var(--fs-caption)", color: "var(--text-muted)" };

// Generic {title, fields[]} renderer — mirrors the design source's own
// generic field-group renderer, driven by constants/userFormFields.js
// instead of ~30 hand-written form fields.
export default function FieldGroup({ title, fields, form, onFieldChange, resolveOptions }) {
  return (
    <fieldset style={{ margin: 0, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px 20px" }}>
      <legend style={legendStyle}>{title}</legend>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px 20px" }}>
        {fields.map((f) => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, gridColumn: f.wide ? "1 / -1" : "auto" }}>
            <span style={fieldLabelStyle}>{f.label}</span>
            {f.kind === "text" && (
              <Input type={f.type || "text"} value={form[f.key] || ""} onChange={(e) => onFieldChange(f.key, e.target.value)} placeholder={f.placeholder} />
            )}
            {f.kind === "select" && (
              <Select value={form[f.key] || ""} onChange={(e) => onFieldChange(f.key, e.target.value)} options={f.options || resolveOptions(f)} />
            )}
            {f.kind === "textarea" && (
              <Textarea value={form[f.key] || ""} onChange={(e) => onFieldChange(f.key, e.target.value)} rows={3} placeholder={f.placeholder} />
            )}
            {f.hint && <span style={hintStyle}>{f.hint}</span>}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
