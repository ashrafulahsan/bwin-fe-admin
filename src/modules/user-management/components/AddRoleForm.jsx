"use client";

import { Button, Input, Textarea } from "@/components/ui";

const fieldLabelStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" };
const hintStyle = { fontSize: "var(--fs-caption)", color: "var(--text-muted)" };

export default function AddRoleForm({ form, onFieldChange, permissions, resources, onTogglePerm, onSelectAll, onClearAll, formError, onCancel, onSave }) {
  const level = Number(form.level);
  const levelHint = level >= 60 ? "High-trust role — grants wide access." : level >= 30 ? "Standard operational role." : "Low-privilege / read-mostly role.";
  const levelHintColor = level >= 60 ? "var(--state-warning)" : "var(--text-muted)";

  const permGroups = resources
    .map((resource) => ({ resource, items: permissions.filter((p) => p.resource === resource) }))
    .filter((g) => g.items.length);

  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden", maxWidth: 900 }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>New role</div>
        <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>
          Roles group permissions. Give it a clear name and grant only what the job needs.
        </div>
      </div>

      <div style={{ padding: "22px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={fieldLabelStyle}>Role name</span>
          <Input value={form.name} onChange={(e) => onFieldChange("name", e.target.value)} placeholder="e.g. Course reviewer" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={fieldLabelStyle}>Slug</span>
          <Input value={form.slug} onChange={(e) => onFieldChange("slug", e.target.value)} placeholder="course-reviewer" />
          <span style={hintStyle}>Auto-filled from the name — edit if you need a different key.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={fieldLabelStyle}>Level (0–100)</span>
          <Input type="number" value={form.level} onChange={(e) => onFieldChange("level", e.target.value)} />
          <span style={{ fontSize: "var(--fs-caption)", color: levelHintColor }}>{levelHint}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
          <span style={fieldLabelStyle}>Description</span>
          <Textarea value={form.description} onChange={(e) => onFieldChange("description", e.target.value)} rows={3} placeholder="What can someone with this role do?" />
        </div>
      </div>

      <div style={{ padding: "0 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={fieldLabelStyle}>Permissions</span>
          <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {form.codes.length} of {permissions.length} selected
          </span>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onSelectAll}
            style={{ padding: "6px 10px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
          >
            Select all
          </button>
          <button
            type="button"
            onClick={onClearAll}
            style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "var(--fs-caption)", cursor: "pointer", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Clear
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {permGroups.map((group) => (
            <div key={group.resource} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 16px" }}>
              <div style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                {group.resource}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {group.items.map((p) => (
                  <label key={p.code} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form.codes.includes(p.code)}
                      onChange={() => onTogglePerm(p.code)}
                      style={{ margin: "2px 0 0", width: 16, height: 16, flex: "none", accentColor: "var(--orange-500)", cursor: "pointer" }}
                    />
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>{p.name}</span>
                      <span style={{ display: "block", fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{p.code}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {formError && (
        <div style={{ margin: "16px 24px 0", padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--state-error-bg)", color: "var(--state-error)", fontSize: "var(--fs-body-sm)" }}>
          {formError}
        </div>
      )}

      <div style={{ padding: "20px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="accent" onClick={onSave}>
          Create role
        </Button>
      </div>
    </div>
  );
}
