"use client";

import { Button, Icon } from "@/components/ui";

const BODY_FONT = "var(--font-body)";
const MONO_FONT = "var(--font-mono)";

function roleFields(role, grantedCount) {
  return [
    { label: "name", value: role.name, font: BODY_FONT },
    { label: "slug", value: role.slug, font: MONO_FONT },
    { label: "level", value: String(role.level), font: MONO_FONT },
    { label: "is_system", value: String(role.is_system), font: MONO_FONT },
    { label: "users assigned", value: String(role.users_count), font: MONO_FONT },
    { label: "permissions granted", value: String(grantedCount), font: MONO_FONT },
    { label: "created_at", value: role.created_at, font: MONO_FONT },
    { label: "description", value: role.description, font: BODY_FONT },
  ];
}

function permFields(perm, grantedToLabel) {
  return [
    { label: "code", value: perm.code, font: MONO_FONT },
    { label: "resource", value: perm.resource, font: BODY_FONT },
    { label: "action", value: perm.action, font: BODY_FONT },
    { label: "is_system", value: String(perm.is_system), font: MONO_FONT },
    { label: "granted to roles", value: grantedToLabel || "—", font: BODY_FONT },
    { label: "description", value: perm.description, font: BODY_FONT },
  ];
}

export default function RoleDetailModal({ role, permission, allPermissions, roleCodes, grantedTo, onClose }) {
  const current = role || permission;
  if (!current) return null;

  const title = role ? role.name : permission.name;
  const fields = role ? roleFields(role, roleCodes.length) : permFields(permission, grantedTo(permission.code).join(", "));

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,25,47,0.45)",
        zIndex: 60,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 20px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 640, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>{title}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", overflowWrap: "anywhere" }}>{current.id}</div>
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

        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px 20px" }}>
          {fields.map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>{f.label}</span>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: f.font, overflowWrap: "anywhere" }}>{f.value}</span>
            </div>
          ))}
        </div>

        {role && (
          <div style={{ padding: "0 24px 8px" }}>
            <div style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", marginBottom: 8 }}>role_permissions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {allPermissions.map((p) => {
                const on = roleCodes.includes(p.code);
                return (
                  <div key={p.code} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                    <span style={{ width: 18, flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={on ? "check" : "minus"} size={14} style={{ color: on ? "var(--state-success)" : "var(--text-muted)" }} />
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-sm)", color: "var(--text-primary)" }}>{p.code}</span>
                    <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{p.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ padding: "16px 24px 20px", display: "flex", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
