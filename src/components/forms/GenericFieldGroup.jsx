"use client";

import { Input, Select, Textarea } from "@/components/ui";
import RichTextEditor from "./RichTextEditor";

const legendStyle = { padding: "0 8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" };
const fieldLabelStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" };
const hintStyle = { fontSize: "var(--fs-caption)", color: "var(--text-muted)" };

// Generic {title, fields[]} form-group renderer, driven by a declarative
// field-config array (see modules/lms/constants/courseFormFields.js and
// modules/business/constants/consultancyFormFields.js) — mirrors the design
// sources' own generic renderer instead of hand-writing each input. Shared
// across every admin form that has this "grouped fieldset" shape.
// field.kind: "text" | "select" | "textarea" | "bool" | "rich".
export default function GenericFieldGroup({ title, fields, form, onFieldChange, resolveOptions, richPlaceholder }) {
  return (
    <fieldset style={{ margin: 0, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px 20px" }}>
      <legend style={legendStyle}>{title}</legend>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px 20px" }}>
        {fields.map((f) => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, gridColumn: f.wide ? "1 / -1" : "auto" }}>
            {f.kind !== "bool" && <span style={fieldLabelStyle}>{f.label}</span>}

            {f.kind === "text" && (
              <Input type={f.type || "text"} value={form[f.key] ?? ""} onChange={(e) => onFieldChange(f.key, e.target.value)} placeholder={f.placeholder} />
            )}
            {f.kind === "select" && (
              <Select value={form[f.key] ?? ""} onChange={(e) => onFieldChange(f.key, e.target.value)} options={f.options || resolveOptions(f)} />
            )}
            {f.kind === "textarea" && (
              <Textarea value={form[f.key] ?? ""} onChange={(e) => onFieldChange(f.key, e.target.value)} rows={f.rows || 3} placeholder={f.placeholder} />
            )}
            {f.kind === "bool" && (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  background: form[f.key] ? "var(--surface-sunken)" : "transparent",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!form[f.key]}
                  onChange={(e) => onFieldChange(f.key, e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "var(--orange-500)", cursor: "pointer" }}
                />
                <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>{f.label}</span>
              </label>
            )}
            {f.kind === "rich" && (
              <RichTextEditor value={form[f.key] ?? ""} onChange={(html) => onFieldChange(f.key, html)} placeholder={f.richPlaceholder || richPlaceholder} />
            )}

            {f.hint && <span style={hintStyle}>{f.hint}</span>}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
