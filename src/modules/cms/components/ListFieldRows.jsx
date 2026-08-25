"use client";

import { Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";

export default function ListFieldRows({ rows, noFields }) {
  return (
    <>
      <div style={{ padding: "9px 18px", background: "var(--surface-sunken)", borderBottom: "1px solid var(--border)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
        Fields defined here appear on every entry form in this category — stored as <span style={{ fontFamily: "var(--font-mono)" }}>master_crud_field_values</span>.
      </div>

      {rows.map((f) => (
        <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border)", opacity: f.opacity }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>{f.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)", padding: "2px 7px", border: "1px solid var(--border)", borderRadius: "var(--radius-xs)" }}>{f.type}</span>
              {f.required && <Badge tone="brand">Required</Badge>}
              <Badge tone={f.tone}>{f.status}</Badge>
            </div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2 }}>{f.metaLine}</div>
          </div>
          <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <RowActionButton icon={<Icon name="pencil-square" size={15} />} title="Edit" onClick={f.onEdit} />
            <RowActionButton
              icon={<Icon name={f.trashLabel === "Restore" ? "arrow-uturn-left" : "trash"} size={15} style={f.trashLabel === "Restore" ? undefined : { color: "var(--state-error)" }} />}
              title={f.trashLabel}
              danger={f.trashLabel !== "Restore"}
              onClick={f.onTrash}
            />
          </div>
        </div>
      ))}

      {noFields && (
        <div style={{ padding: "34px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No extra fields yet — this category only uses title, link, description and order.
        </div>
      )}
    </>
  );
}
