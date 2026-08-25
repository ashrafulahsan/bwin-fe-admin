"use client";

import { Fragment } from "react";
import { Button } from "@/components/ui";

export default function AssignMatrix({ roles, permissions, grants, dirty, savedNotice, onToggle, onSave, onRevert }) {
  const columns = `minmax(260px,1.4fr) repeat(${roles.length || 1}, minmax(120px,1fr))`;
  const minWidth = `${260 + Math.max(roles.length, 1) * 130}px`;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <p style={{ margin: 0, fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", maxWidth: 560 }}>
          Tick a cell to grant that permission to the role. Changes are staged until you save — system roles are locked.
        </p>
        <div style={{ flex: 1 }} />
        {dirty && (
          <>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>unsaved changes</span>
            <Button variant="secondary" onClick={onRevert}>
              Revert
            </Button>
          </>
        )}
        <Button variant="accent" onClick={onSave}>
          Save assignments
        </Button>
      </div>

      {savedNotice && (
        <div
          style={{
            marginBottom: 14,
            padding: "10px 12px",
            borderRadius: "var(--radius-sm)",
            background: "var(--state-success-bg)",
            color: "var(--state-success)",
            fontSize: "var(--fs-body-sm)",
          }}
        >
          {savedNotice}
        </div>
      )}

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: columns, minWidth }}>
          <div style={{ padding: "12px 20px", background: "var(--surface-sunken)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", position: "sticky", left: 0 }}>
            Permission
          </div>
          {roles.map((role) => (
            <div key={role.id} style={{ padding: "12px 10px", background: "var(--surface-sunken)", textAlign: "center" }}>
              <div style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>{role.name}</div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {role.is_system ? "system · locked" : `level ${role.level}`}
              </div>
            </div>
          ))}

          {permissions.map((perm) => (
            <Fragment key={perm.id}>
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid var(--border)",
                  position: "sticky",
                  left: 0,
                  background: "var(--surface-card)",
                  minWidth: 0,
                }}
              >
                <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{perm.code}</div>
                <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{perm.name}</div>
              </div>
              {roles.map((role) => {
                const checked = (grants[role.id] || []).includes(perm.code);
                return (
                  <div
                    key={`${perm.id}-${role.id}`}
                    style={{
                      borderTop: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px 10px",
                      background: role.is_system ? "var(--surface-sunken)" : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={role.is_system}
                      onChange={() => onToggle(role.id, perm.code)}
                      style={{ width: 16, height: 16, accentColor: "var(--orange-500)", cursor: role.is_system ? "not-allowed" : "pointer" }}
                    />
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
