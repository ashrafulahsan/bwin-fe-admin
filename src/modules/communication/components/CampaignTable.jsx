"use client";

import { Badge } from "@/components/ui";
import { darkBadgeStyle } from "@/utils/badgeTone";

const GRID_COLUMNS = "2.6fr 1.1fr 0.9fr 1.6fr 1.1fr 130px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };
const actionButtonStyle = {
  padding: "6px 10px",
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--radius-sm)",
  background: "var(--surface-card)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: "var(--fs-caption)",
  fontWeight: "var(--fw-medium)",
  cursor: "pointer",
};

export default function CampaignTable({ rows, noResults, darkMode }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1200 }}>
        <div style={headerCellStyle}>Campaign</div>
        <div style={headerCellStyle}>Segment</div>
        <div style={headerCellStyle}>Status</div>
        <div style={headerCellStyle}>Opens / clicks</div>
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
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {row.subject}
            </div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span style={{ fontFamily: "var(--font-mono)" }}>{row.id}</span> · {row.created_by} · {row.recipientLabel}
            </div>
          </div>

          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.segmentLabel}</div>
          <div>
            <Badge tone={row.statusTone} style={darkBadgeStyle(row.statusTone, darkMode)}>
              {row.statusLabel}
            </Badge>
          </div>
          <div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{row.rateLabel}</div>
            <div style={{ height: 4, borderRadius: 999, background: "var(--surface-sunken)", marginTop: 6, overflow: "hidden", maxWidth: 160 }}>
              <div style={{ height: "100%", width: row.openBar, background: "var(--navy-700)" }} />
            </div>
          </div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.whenValue}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={row.onView}
              style={actionButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
            >
              View
            </button>
            <button
              type="button"
              onClick={row.onEdit}
              style={actionButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No campaigns match these filters — clear the search or pick another status.
        </div>
      )}
    </div>
  );
}
