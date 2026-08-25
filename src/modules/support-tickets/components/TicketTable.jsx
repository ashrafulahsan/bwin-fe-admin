"use client";

import { Avatar, Badge, Icon, Select } from "@/components/ui";
import { RowActionButton } from "@/components/tables";

const GRID_COLUMNS = "1.9fr 1.3fr 1fr 130px 1.1fr 1.1fr 1fr 46px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function TicketTable({ rows, noResults, statusChangeOptions, assigneeOptions }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1240 }}>
        <div style={headerCellStyle}>Ticket</div>
        <div style={headerCellStyle}>Student</div>
        <div style={headerCellStyle}>Category</div>
        <div style={headerCellStyle}>Priority</div>
        <div style={headerCellStyle}>Status</div>
        <div style={headerCellStyle}>Assigned to</div>
        <div style={headerCellStyle}>Last reply</div>
        <div />
      </div>

      {rows.map((row) => (
        <div
          key={row.id}
          style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", borderTop: "1px solid var(--border)", alignItems: "center", minWidth: 1240 }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.ticket_no}</span>
              {row.is_escalated && (
                <Badge tone="error" style={{ height: 18 }}>
                  Escalated
                </Badge>
              )}
            </div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {row.subject}
            </div>
          </div>

          <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar name={row.student_name} size={26} />
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.student_name}</div>
          </div>

          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{row.category}</div>

          <div>
            <Badge tone={row.priorityTone}>{row.priorityLabel}</Badge>
          </div>

          <div>
            <Select value={row.status} onChange={row.onStatusChange} options={statusChangeOptions} />
          </div>

          <div>
            <Select value={row.assignedValue} onChange={row.onAssignChange} options={assigneeOptions} />
          </div>

          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.lastReplyDisplay}</div>

          <div>
            <RowActionButton icon={<Icon name="eye" size={15} />} title="View ticket" onClick={row.onView} />
          </div>
        </div>
      ))}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No tickets match these filters — try clearing the search or widening the criteria.
        </div>
      )}
    </div>
  );
}
