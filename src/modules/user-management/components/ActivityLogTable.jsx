"use client";

import { Avatar, Badge } from "@/components/ui";
import { darkBadgeStyle } from "@/utils/badgeTone";
import { LOG_STATUS_TONES } from "../constants/activityLogs.mock";

const GRID_COLUMNS = "1.3fr 0.8fr 1fr 1.7fr 0.8fr 1.1fr 110px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function ActivityLogTable({ rows, noResults, darkMode, onView }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1040 }}>
        <div style={headerCellStyle}>User</div>
        <div style={headerCellStyle}>Action</div>
        <div style={headerCellStyle}>Module</div>
        <div style={headerCellStyle}>Description</div>
        <div style={headerCellStyle}>Status</div>
        <div style={headerCellStyle}>Created at</div>
        <div style={headerCellStyle} />
      </div>

      {rows.map((row) => {
        const tone = LOG_STATUS_TONES[row.status] || "neutral";
        return (
          <div
            key={row.id}
            style={{
              display: "grid",
              gridTemplateColumns: GRID_COLUMNS,
              gap: 12,
              padding: "12px 20px",
              borderTop: "1px solid var(--border)",
              alignItems: "center",
              minWidth: 1040,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <Avatar name={row.user_name} size={28} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {row.user_name}
                </div>
                <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {row.role_name}
                </div>
              </div>
            </div>

            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.action}</div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.module}</div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.description}
            </div>
            <div>
              <Badge tone={tone} style={darkBadgeStyle(tone, darkMode)}>
                {row.status}
              </Badge>
            </div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.created_at}</div>
            <div>
              <button
                type="button"
                onClick={() => onView(row.id)}
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
                View details
              </button>
            </div>
          </div>
        );
      })}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No activity matches these filters — try widening the date range.
        </div>
      )}
    </div>
  );
}
