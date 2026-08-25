"use client";

import { Avatar, Select } from "@/components/ui";

const GRID_COLUMNS = "1.2fr 1.5fr 1fr 1.9fr 150px 1fr 80px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function ContactTable({ rows, noResults, statusChangeOptions, onStatusChange, onView }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1180 }}>
        <div style={headerCellStyle}>Full name</div>
        <div style={headerCellStyle}>Email / phone</div>
        <div style={headerCellStyle}>Interested in</div>
        <div style={headerCellStyle}>Message</div>
        <div style={headerCellStyle}>Status</div>
        <div style={headerCellStyle}>Received</div>
        <div style={headerCellStyle} />
      </div>

      {rows.map((row) => (
        <div
          key={row.id}
          style={{
            display: "grid",
            gridTemplateColumns: GRID_COLUMNS,
            gap: 12,
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            alignItems: "center",
            minWidth: 1180,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <Avatar name={row.full_name} size={28} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {row.full_name}
              </div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.id}</div>
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.email}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.phone}</div>
          </div>

          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.interested_in}</div>

          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.message}</div>

          <div>
            <Select value={row.status} onChange={(e) => onStatusChange(row.id, e.target.value)} options={statusChangeOptions} />
          </div>

          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.created_at}</div>

          <div>
            <button
              type="button"
              onClick={() => onView(row)}
              style={{
                padding: "6px 10px",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-card)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-caption)",
                fontWeight: "var(--fw-medium)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
            >
              View
            </button>
          </div>
        </div>
      ))}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No submissions match these filters — try clearing the search or widening the date range.
        </div>
      )}
    </div>
  );
}
