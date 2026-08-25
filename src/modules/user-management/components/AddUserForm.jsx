"use client";

import { Button } from "@/components/ui";
import FieldGroup from "./FieldGroup";
import { USER_FORM_GROUPS } from "../constants/userFormFields";
import { USER_STATUSES, LANGUAGES, ROLE_CHOICES } from "../constants/users.mock";

const capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);

function resolveOptions(field) {
  if (field.optionsFrom === "statuses") return USER_STATUSES.map((v) => ({ value: v, label: capitalize(v) }));
  if (field.optionsFrom === "languages") return Object.entries(LANGUAGES).map(([value, label]) => ({ value, label }));
  return [];
}

const [PRIMARY_GROUP, ...EXTRA_GROUPS] = USER_FORM_GROUPS;

export default function AddUserForm({ form, onFieldChange, roles, onToggleRole, extrasOpen, onToggleExtras, formError, onCancel, onSave }) {
  const extrasFilled = EXTRA_GROUPS.reduce(
    (n, g) => n + g.fields.filter((f) => String(form[f.key] || "").trim()).length,
    0
  );

  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        maxWidth: 960,
      }}
    >
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>
          New user
        </div>
        <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>
          An email or a phone number is required — everything else can be filled in later.
        </div>
      </div>

      <div style={{ padding: "22px 24px 8px", display: "flex", flexDirection: "column", gap: 22 }}>
        <FieldGroup title={PRIMARY_GROUP.title} fields={PRIMARY_GROUP.fields} form={form} onFieldChange={onFieldChange} resolveOptions={resolveOptions} />

        <fieldset style={{ margin: 0, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px 20px" }}>
          <legend style={{ padding: "0 8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" }}>
            Roles
          </legend>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {ROLE_CHOICES.map((name) => {
              const checked = roles.includes(name);
              return (
                <label
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    border: `1px solid ${checked ? "var(--orange-500)" : "var(--border-strong)"}`,
                    borderRadius: "var(--radius-sm)",
                    background: checked ? "var(--surface-sunken)" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleRole(name)}
                    style={{ width: 16, height: 16, accentColor: "var(--orange-500)", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>{name}</span>
                </label>
              );
            })}
          </div>
          <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 10 }}>Writes one row per role into user_roles.</div>
        </fieldset>

        <button
          type="button"
          onClick={onToggleExtras}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "12px 14px",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-card)",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "var(--font-body)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
        >
          <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" }}>
            Additional details
          </span>
          <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
            {extrasFilled ? `${extrasFilled} field${extrasFilled === 1 ? "" : "s"} filled` : "Personal, address, professional, education, social — all optional"}
          </span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>{extrasOpen ? "Hide" : "Show"}</span>
        </button>

        {extrasOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {EXTRA_GROUPS.map((group) => (
              <FieldGroup key={group.title} title={group.title} fields={group.fields} form={form} onFieldChange={onFieldChange} resolveOptions={resolveOptions} />
            ))}
          </div>
        )}
      </div>

      {formError && (
        <div style={{ margin: "0 24px", padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--state-error-bg)", color: "var(--state-error)", fontSize: "var(--fs-body-sm)" }}>
          {formError}
        </div>
      )}

      <div style={{ padding: "20px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="accent" onClick={onSave}>
          Create user
        </Button>
      </div>
    </div>
  );
}
