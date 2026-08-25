"use client";

import { Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";
import { darkBadgeStyle } from "@/utils/badgeTone";

const GRID_COLUMNS = "1.3fr 1.8fr 0.6fr 0.7fr 2fr 132px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function RoleTable({ rows, grants, noResults, darkMode, onView, onDuplicate, onDelete }) {
  const neutralStyle = darkBadgeStyle("neutral", darkMode);

  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1080 }}>
        <div style={headerCellStyle}>Role</div>
        <div style={headerCellStyle}>Description</div>
        <div style={headerCellStyle}>Level</div>
        <div style={headerCellStyle}>Users</div>
        <div style={headerCellStyle}>Permissions</div>
        <div style={{ ...headerCellStyle, textAlign: "right" }}>Actions</div>
      </div>

      {rows.map((role) => {
        const codes = grants[role.id] || [];
        return (
          <div
            key={role.id}
            style={{
              display: "grid",
              gridTemplateColumns: GRID_COLUMNS,
              gap: 12,
              padding: "12px 20px",
              borderTop: "1px solid var(--border)",
              alignItems: "center",
              minWidth: 1080,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)" }}>{role.name}</span>
                {role.is_system && (
                  <Badge tone="neutral" style={neutralStyle}>
                    System
                  </Badge>
                )}
              </div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{role.slug}</div>
            </div>

            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{role.description}</div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{role.level}</div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{role.users_count}</div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {codes.map((code) => (
                <Badge key={code} tone="neutral" style={neutralStyle}>
                  {code}
                </Badge>
              ))}
            </div>

            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              {/* "Edit role" reuses the read-only detail view, same as the design source — there is no inline role editor to replicate. */}
              <RowActionButton title="View permissions" icon={<Icon name="eye" size={15} />} onClick={() => onView(role.id)} />
              <RowActionButton title="Edit role" icon={<Icon name="pencil-square" size={15} />} onClick={() => onView(role.id)} />
              <RowActionButton title="Duplicate" icon={<Icon name="document-duplicate" size={15} />} onClick={() => onDuplicate(role)} />
              {role.is_system ? (
                <button
                  type="button"
                  title="System roles cannot be deleted"
                  disabled
                  style={{
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "transparent",
                    cursor: "not-allowed",
                    opacity: 0.5,
                  }}
                >
                  <Icon name="trash" size={15} style={{ color: "var(--text-muted)" }} />
                </button>
              ) : (
                <RowActionButton
                  title="Delete role"
                  danger
                  icon={<Icon name="trash" size={15} style={{ color: "var(--state-error)" }} />}
                  onClick={() => onDelete(role.id)}
                />
              )}
            </div>
          </div>
        );
      })}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No roles match these filters.
        </div>
      )}
    </div>
  );
}
