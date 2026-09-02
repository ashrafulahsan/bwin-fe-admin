"use client";

import { useRef } from "react";
import { Avatar, Button } from "@/components/ui";
import FieldGroup from "./FieldGroup";
import { USER_FORM_GROUPS } from "../constants/userFormFields";
import { USER_STATUSES, LANGUAGES } from "../constants/users.mock";

const capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);

function resolveOptions(field) {
  if (field.optionsFrom === "statuses") return USER_STATUSES.map((v) => ({ value: v, label: capitalize(v) }));
  if (field.optionsFrom === "languages") return Object.entries(LANGUAGES).map(([value, label]) => ({ value, label }));
  return [];
}

const [PRIMARY_GROUP, ...EXTRA_GROUPS] = USER_FORM_GROUPS;

export default function AddUserForm({
  form,
  onFieldChange,
  avatarHint,
  onAvatarFile,
  removeAvatar,
  availableRoles,
  onToggleRole,
  formError,
  onCancel,
  onSave,
  saving,
}) {
  const fileInputRef = useRef(null);
  const fullName = [form.first_name, form.last_name].filter(Boolean).join(" ");

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
        <fieldset style={{ margin: 0, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px 20px" }}>
          <legend style={{ padding: "0 8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" }}>
            Profile picture
          </legend>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={fullName} src={form.avatar_url || undefined} size={56} style={{ border: "1px solid var(--border)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{ padding: "8px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
                >
                  Upload photo
                </button>
                <button
                  type="button"
                  onClick={removeAvatar}
                  style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", cursor: "pointer", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Remove
                </button>
              </div>
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{avatarHint}</span>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => onAvatarFile(e.target.files && e.target.files[0])} style={{ display: "none" }} />
        </fieldset>

        <FieldGroup title={PRIMARY_GROUP.title} fields={PRIMARY_GROUP.fields} form={form} onFieldChange={onFieldChange} resolveOptions={resolveOptions} />

        <fieldset style={{ margin: 0, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px 20px" }}>
          <legend style={{ padding: "0 8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" }}>
            Roles
          </legend>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {(availableRoles || []).map((role) => {
              const checked = form.role_ids.includes(role.id);
              return (
                <label
                  key={role.id}
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
                    onChange={() => onToggleRole(role.id)}
                    style={{ width: 16, height: 16, accentColor: "var(--orange-500)", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>{role.name}</span>
                </label>
              );
            })}
          </div>
          <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 10 }}>Writes one row per role into user_roles.</div>
        </fieldset>

        {EXTRA_GROUPS.map((group) => (
          <FieldGroup key={group.title} title={group.title} fields={group.fields} form={form} onFieldChange={onFieldChange} resolveOptions={resolveOptions} />
        ))}
      </div>

      {formError && (
        <div style={{ margin: "0 24px", padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--state-error-bg)", color: "var(--state-error)", fontSize: "var(--fs-body-sm)" }}>
          {formError}
        </div>
      )}

      <div style={{ padding: "20px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button variant="accent" onClick={onSave} disabled={saving}>
          {saving ? "Creating…" : "Create user"}
        </Button>
      </div>
    </div>
  );
}
