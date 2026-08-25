"use client";

import { Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";
import { darkBadgeStyle } from "@/utils/badgeTone";
import { AUTOMATION_STATUS_TONES, AUTOMATION_CATEGORIES, nameById } from "../constants/automations.mock";

const GRID_COLUMNS = "2.4fr 1.2fr 1.6fr 0.9fr 1.1fr 1fr 160px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

export default function AutomationTable({ rows, noResults, darkMode, onView, onEdit, onDuplicate, onPublish, onDelete }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1260 }}>
        <div style={headerCellStyle}>Automation</div>
        <div style={headerCellStyle}>Category</div>
        <div style={headerCellStyle}>What it does</div>
        <div style={headerCellStyle}>Status</div>
        <div style={headerCellStyle}>Published</div>
        <div style={headerCellStyle}>Updated</div>
        <div style={{ ...headerCellStyle, textAlign: "right" }}>Actions</div>
      </div>

      {rows.map((a) => {
        const tone = AUTOMATION_STATUS_TONES[a.status] || "neutral";
        const published = a.status === "published";
        const lists = a.lists || [];
        const isDeleted = !!a.deleted_at;

        return (
          <div
            key={a.id}
            style={{
              display: "grid",
              gridTemplateColumns: GRID_COLUMNS,
              gap: 12,
              padding: "12px 20px",
              borderTop: "1px solid var(--border)",
              alignItems: "center",
              minWidth: 1260,
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
                {a.image_url ? "IMG" : "no img"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.title}
                </div>
                <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  /{a.slug}
                </div>
              </div>
            </div>

            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", minWidth: 0 }}>{nameById(AUTOMATION_CATEGORIES, a.category_id)}</div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {lists[0] || "—"}
              </div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{lists.length ? `${lists.length} lines` : "no lines"}</div>
            </div>

            <div>
              <Badge tone={tone} style={darkBadgeStyle(tone, darkMode)}>
                {a.status}
              </Badge>
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {a.published_at ? String(a.published_at).slice(0, 10) : "not published"}
              </div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{(a.runs_30d || 0).toLocaleString("en-US")} runs/30d</div>
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{String(a.updated_at).slice(0, 10)}</div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{a.updated_by || "—"}</div>
            </div>

            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <RowActionButton title="View details" icon={<Icon name="eye" size={15} />} onClick={() => onView(a.id)} />
              <RowActionButton title="Edit automation" icon={<Icon name="pencil-square" size={15} />} onClick={() => onEdit(a)} />
              <RowActionButton title="Duplicate" icon={<Icon name="square-2-stack" size={15} />} onClick={() => onDuplicate(a)} />
              <RowActionButton
                title={published ? "Unpublish (back to draft)" : "Publish"}
                icon={<Icon name={published ? "arrow-down-tray" : "arrow-up-tray"} size={15} />}
                onClick={() => onPublish(a)}
              />
              {isDeleted ? (
                <RowActionButton title="Restore" icon={<Icon name="arrow-path" size={15} />} onClick={() => onDelete(a)} />
              ) : (
                <RowActionButton title="Delete (soft)" danger icon={<Icon name="trash" size={15} style={{ color: "var(--state-error)" }} />} onClick={() => onDelete(a)} />
              )}
            </div>
          </div>
        );
      })}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No automations match these filters — try clearing the search.
        </div>
      )}
    </div>
  );
}
