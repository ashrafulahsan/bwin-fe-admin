"use client";

import { Avatar, Select } from "@/components/ui";

const GRID_COLUMNS = "1.6fr 1.8fr 1fr 1fr 0.9fr 1.1fr 100px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function SubscriberTable({ rows, noResults, statusChangeOptions }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1180 }}>
        <div style={headerCellStyle}>Subscriber</div>
        <div style={headerCellStyle}>Email</div>
        <div style={headerCellStyle}>Segment</div>
        <div style={headerCellStyle}>Source</div>
        <div style={headerCellStyle}>Open rate</div>
        <div style={headerCellStyle}>Status</div>
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
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.subscribed_at}</div>
            </div>
          </div>

          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.email}</div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.segmentLabel}</div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.source}</div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{row.openRateLabel}</div>
          <div>
            <Select value={row.status} onChange={(e) => row.onStatusChange(e.target.value)} options={statusChangeOptions} />
          </div>
          <div>
            <button
              type="button"
              onClick={row.onRemove}
              style={{
                padding: "6px 10px",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-card)",
                color: "var(--red-700)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-caption)",
                fontWeight: "var(--fw-medium)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--red-100)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>No subscribers match these filters.</div>
      )}
    </div>
  );
}
