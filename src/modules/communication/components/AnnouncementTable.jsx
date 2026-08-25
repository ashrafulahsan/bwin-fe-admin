"use client";

import { Switch, Tag } from "@/components/ui";

const GRID_COLUMNS = "2.4fr 1fr 0.9fr 1.1fr 1.3fr 1fr 150px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

function RowButton({ children, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 10px",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-card)",
        color: danger ? "var(--red-700)" : "var(--text-primary)",
        fontFamily: "var(--font-body)",
        fontSize: "var(--fs-caption)",
        fontWeight: "var(--fw-medium)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = danger ? "var(--red-100)" : "var(--surface-sunken)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
    >
      {children}
    </button>
  );
}

export default function AnnouncementTable({ rows, noResults }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1240 }}>
        <div style={headerCellStyle}>Announcement</div>
        <div style={headerCellStyle}>Placement</div>
        <div style={headerCellStyle}>Content</div>
        <div style={headerCellStyle}>Audience</div>
        <div style={headerCellStyle}>Schedule</div>
        <div style={headerCellStyle}>Active</div>
        <div style={headerCellStyle} />
      </div>

      {rows.map((row) => (
        <div
          key={row.id}
          style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", borderTop: "1px solid var(--border)", alignItems: "center", minWidth: 1240, background: row.rowBg }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {row.title}
            </div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span style={{ fontFamily: "var(--font-mono)" }}>{row.id}</span> · {row.preview}
            </div>
          </div>

          <div>
            <Tag>{row.placementLabel}</Tag>
          </div>

          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.typeLabel}</div>

          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.audienceLabel}</div>

          <div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{row.starts_at}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>→ {row.ends_at}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Switch checked={row.is_active} onChange={row.onToggle} />
            <span style={{ fontSize: "var(--fs-caption)", color: row.activeColor, fontWeight: "var(--fw-medium)" }}>{row.activeLabel}</span>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <RowButton onClick={row.onEdit}>Edit</RowButton>
            <RowButton onClick={row.onDuplicate}>Copy</RowButton>
            <RowButton danger onClick={row.onDelete}>
              Delete
            </RowButton>
          </div>
        </div>
      ))}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>No announcements match these filters.</div>
      )}
    </div>
  );
}
