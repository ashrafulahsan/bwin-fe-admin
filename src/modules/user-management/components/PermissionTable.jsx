"use client";

import { Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";
import { darkBadgeStyle } from "@/utils/badgeTone";

const GRID_COLUMNS = "1.2fr 1.2fr 0.8fr 0.8fr 1.8fr 100px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function PermissionTable({ rows, grantedTo, noResults, darkMode, onView }) {
  const neutralStyle = darkBadgeStyle("neutral", darkMode);

  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1000 }}>
        <div style={headerCellStyle}>Code</div>
        <div style={headerCellStyle}>Name</div>
        <div style={headerCellStyle}>Resource</div>
        <div style={headerCellStyle}>Action</div>
        <div style={headerCellStyle}>Granted to roles</div>
        <div style={{ ...headerCellStyle, textAlign: "right" }}>Actions</div>
      </div>

      {rows.map((perm) => (
        <div
          key={perm.id}
          style={{
            display: "grid",
            gridTemplateColumns: GRID_COLUMNS,
            gap: 12,
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            alignItems: "center",
            minWidth: 1000,
          }}
        >
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontWeight: "var(--fw-medium)" }}>
            {perm.code}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{perm.name}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{perm.description}</div>
          </div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{perm.resource}</div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{perm.action}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {grantedTo(perm.code).map((name) => (
              <Badge key={name} tone="neutral" style={neutralStyle}>
                {name}
              </Badge>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            {/* "Edit" reuses the read-only detail view, same as the design source. */}
            <RowActionButton title="View" icon={<Icon name="eye" size={15} />} onClick={() => onView(perm.id)} />
            <RowActionButton title="Edit" icon={<Icon name="pencil-square" size={15} />} onClick={() => onView(perm.id)} />
          </div>
        </div>
      ))}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No permissions match these filters.
        </div>
      )}
    </div>
  );
}
