"use client";

import { Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";
import { darkBadgeStyle } from "@/utils/badgeTone";
import { CONSULTANCY_STATUS_TONES, CONSULTANCY_CATEGORIES, nameById } from "../constants/consultancies.mock";

const GRID_COLUMNS = "2.4fr 1.3fr 1fr 1fr 1.1fr 0.7fr 160px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };
const cap = (v) => String(v || "").charAt(0).toUpperCase() + String(v || "").slice(1);

export default function ConsultancyTable({ rows, noResults, darkMode, onView, onEdit, onDuplicate, onToggleStatus, onDelete }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1180 }}>
        <div style={headerCellStyle}>Service</div>
        <div style={headerCellStyle}>Category</div>
        <div style={headerCellStyle}>Type</div>
        <div style={headerCellStyle}>Status</div>
        <div style={headerCellStyle}>Updated</div>
        <div style={headerCellStyle}>Order</div>
        <div style={{ ...headerCellStyle, textAlign: "right" }}>Actions</div>
      </div>

      {rows.map((c) => {
        const tone = CONSULTANCY_STATUS_TONES[c.status] || "neutral";
        const isActive = c.status === "active";
        const isDeleted = !!c.deleted_at;

        return (
          <div
            key={c.id}
            style={{
              display: "grid",
              gridTemplateColumns: GRID_COLUMNS,
              gap: 12,
              padding: "12px 20px",
              borderTop: "1px solid var(--border)",
              alignItems: "center",
              minWidth: 1180,
              background: isDeleted ? "var(--surface-sunken)" : "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 52,
                  height: 36,
                  flex: "none",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  background: "var(--surface-sunken)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                {c.thumbnail ? "IMG" : "no img"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.title}
                </div>
                <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.consultancy_code} · /{c.slug}
                </div>
              </div>
            </div>

            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", minWidth: 0 }}>{nameById(CONSULTANCY_CATEGORIES, c.category_id)}</div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{cap(c.consultancy_type)}</div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{c.engagements} engagements</div>
            </div>

            <div>
              <Badge tone={tone} style={darkBadgeStyle(tone, darkMode)}>
                {c.status}
              </Badge>
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{String(c.updated_at).slice(0, 10)}</div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{c.updated_by || "—"}</div>
            </div>

            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{c.sort_order}</div>

            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <RowActionButton title="View details" icon={<Icon name="eye" size={15} />} onClick={() => onView(c.id)} />
              <RowActionButton title="Edit consultancy" icon={<Icon name="pencil-square" size={15} />} onClick={() => onEdit(c)} />
              <RowActionButton title="Duplicate" icon={<Icon name="square-2-stack" size={15} />} onClick={() => onDuplicate(c)} />
              <RowActionButton
                title={isActive ? "Set inactive" : "Set active"}
                icon={<Icon name={isActive ? "pause" : "play"} size={15} />}
                onClick={() => onToggleStatus(c)}
              />
              {isDeleted ? (
                <RowActionButton title="Restore" icon={<Icon name="arrow-path" size={15} />} onClick={() => onDelete(c)} />
              ) : (
                <RowActionButton title="Delete (soft)" danger icon={<Icon name="trash" size={15} style={{ color: "var(--state-error)" }} />} onClick={() => onDelete(c)} />
              )}
            </div>
          </div>
        );
      })}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No services match these filters — try clearing the search.
        </div>
      )}
    </div>
  );
}
