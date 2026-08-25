"use client";

import { Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";

export default function CategoryTypesList({ types }) {
  return (
    <div style={{ minWidth: 0, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>Category types</div>
        <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2 }}>Each type is a bucket the rest of the CMS reads from. Pick one to manage its categories.</div>
      </div>

      {types.map((t) => (
        <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px 11px 0", borderBottom: "1px solid var(--border)", background: t.bg, borderLeft: `3px solid ${t.stripe}` }}>
          <button
            type="button"
            onClick={t.onSelect}
            style={{ minWidth: 0, flex: 1, textAlign: "left", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-body)", padding: "0 0 0 13px", display: "flex", flexDirection: "column", gap: 3 }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: t.weight, color: "var(--text-primary)" }}>{t.name}</span>
              <Badge tone={t.tone}>{t.status}</Badge>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{t.metaLine}</span>
          </button>
          <RowActionButton icon={<Icon name="pencil-square" size={15} />} title="Edit" onClick={t.onEdit} />
          <RowActionButton
            icon={<Icon name={t.trashLabel === "Restore" ? "arrow-uturn-left" : "trash"} size={15} style={t.trashLabel === "Restore" ? undefined : { color: "var(--state-error)" }} />}
            title={t.trashLabel}
            danger={t.trashLabel !== "Restore"}
            onClick={t.onTrash}
          />
        </div>
      ))}
    </div>
  );
}
