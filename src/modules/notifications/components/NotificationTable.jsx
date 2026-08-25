"use client";

import { Badge, Tag } from "@/components/ui";
import { darkBadgeStyle } from "@/utils/badgeTone";

const GRID_COLUMNS = "2.4fr 1fr 1fr 1fr 0.9fr 1fr 80px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function NotificationTable({ rows, noResults, darkMode, onView }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1200 }}>
        <div style={headerCellStyle}>Notification</div>
        <div style={headerCellStyle}>Type</div>
        <div style={headerCellStyle}>Audience</div>
        <div style={headerCellStyle}>Channel</div>
        <div style={headerCellStyle}>Status</div>
        <div style={headerCellStyle}>Sent / scheduled</div>
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
            minWidth: 1200,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span style={{ width: 6, height: 6, flex: "none", borderRadius: 999, background: row.priorityDot }} />
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {row.title}
              </div>
            </div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingLeft: 14 }}>
              <span style={{ fontFamily: "var(--font-mono)" }}>{row.id}</span> · {row.category} · {row.preview}
            </div>
          </div>

          <div>
            <Tag>{row.originLabel}</Tag>
          </div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.audienceLabel}</div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.channelLabel}</div>
          <div>
            <Badge tone={row.statusTone} style={darkBadgeStyle(row.statusTone, darkMode)}>
              {row.statusLabel}
            </Badge>
          </div>
          <div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.whenValue}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{row.reachLabel}</div>
          </div>
          <div>
            {row.canView ? (
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
                View
              </button>
            ) : (
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>System</span>
            )}
          </div>
        </div>
      ))}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          Nothing here yet — try another tab, or clear the search.
        </div>
      )}
    </div>
  );
}
