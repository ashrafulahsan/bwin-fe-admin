"use client";

import { Input, Select, Textarea } from "@/components/ui";
import RichTextEditor from "./RichTextEditor";

const legendStyle = { padding: "0 8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" };
const fieldLabelStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" };
const hintStyle = { fontSize: "var(--fs-caption)", color: "var(--text-muted)" };

// A repeatable array-of-strings field ("what it does", learning outcomes,
// etc. stored as a JSON array column) — numbered rows with a remove button,
// plus an "Add line" button. `value` is always a non-empty array (an empty
// list collapses to one blank row so there's always something to type into).
function ListLinesField({ value, onChange, hint }) {
  const items = value && value.length ? value : [""];
  const setLine = (i, v) => {
    const next = items.slice();
    next[i] = v;
    onChange(next);
  };
  const removeLine = (i) => {
    const next = items.filter((_, j) => j !== i);
    onChange(next.length ? next : [""]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((line, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 22, flex: "none", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
            {i + 1}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Input value={line} onChange={(e) => setLine(i, e.target.value)} placeholder="One short line — what this step does" />
          </div>
          <button
            type="button"
            title="Remove line"
            onClick={() => removeLine(i)}
            style={{ width: 32, height: 32, flex: "none", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-muted)", fontSize: 14, lineHeight: 1, cursor: "pointer" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--state-error-bg)";
              e.currentTarget.style.color = "var(--state-error)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--surface-card)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          onClick={() => onChange(items.concat(""))}
          style={{
            padding: "8px 12px",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-card)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body-sm)",
            fontWeight: "var(--fw-medium)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
        >
          Add line
        </button>
        {hint && <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{hint}</span>}
      </div>
    </div>
  );
}

// Generic {title, fields[]} form-group renderer, driven by a declarative
// field-config array (see modules/lms/constants/courseFormFields.js and
// modules/business/constants/consultancyFormFields.js) — mirrors the design
// sources' own generic renderer instead of hand-writing each input. Shared
// across every admin form that has this "grouped fieldset" shape.
// field.kind: "text" | "select" | "textarea" | "bool" | "rich" | "list".
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
            {f.kind === "list" && <ListLinesField value={form[f.key]} onChange={(next) => onFieldChange(f.key, next)} hint={f.hint} />}

            {f.hint && f.kind !== "list" && <span style={hintStyle}>{f.hint}</span>}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
