"use client";

import { Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";

export default function ListEntryRows({ rows, noEntries, emptyMessage }) {
  return (
    <>
      {rows.map((e) => (
        <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface-card)", opacity: e.opacity }}>
          <span style={{ flex: "none", width: 26, height: 26, marginTop: 1, border: "1px solid var(--border)", borderRadius: "var(--radius-xs)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
            {e.order}
          </span>
          <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>{e.title}</span>
              <Badge tone={e.tone}>{e.status}</Badge>
              {e.isDeleted && <Badge tone="neutral">Trashed</Badge>}
              {e.incomplete && <Badge tone="warning">{e.incompleteLabel}</Badge>}
            </div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span style={{ fontFamily: "var(--font-mono)" }}>{e.slug}</span>
              {e.metaTail}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {e.chips.map((chip, i) => (
                <span
                  key={i}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, maxWidth: 280, padding: "3px 9px", border: "1px solid var(--border)", borderRadius: 999, background: "var(--surface-sunken)", fontSize: "var(--fs-caption)", color: "var(--text-secondary)" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>{chip.label}</span>
                  <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chip.value}</span>
                </span>
              ))}
            </div>
          </div>
          <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <RowActionButton icon={<Icon name="arrow-up" size={14} />} title="Move up" onClick={e.onUp} />
            <RowActionButton icon={<Icon name="arrow-down" size={14} />} title="Move down" onClick={e.onDown} />
            <RowActionButton icon={<Icon name="pencil-square" size={15} />} title="Edit" onClick={e.onEdit} />
            <RowActionButton icon={<Icon name="document-duplicate" size={15} />} title="Duplicate" onClick={e.onDuplicate} />
            <RowActionButton
              icon={<Icon name={e.trashLabel === "Restore" ? "arrow-uturn-left" : "trash"} size={15} style={e.trashLabel === "Restore" ? undefined : { color: "var(--state-error)" }} />}
              title={e.trashLabel}
              danger={e.trashLabel !== "Restore"}
              onClick={e.onTrash}
            />
          </div>
        </div>
      ))}

      {noEntries && <div style={{ padding: "34px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>{emptyMessage}</div>}
    </>
  );
}
