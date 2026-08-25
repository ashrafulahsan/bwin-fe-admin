"use client";

import { Badge, Icon, Input, Select, Switch } from "@/components/ui";
import { RowActionButton } from "@/components/tables";

export default function CategoryTree({
  paneTitle,
  paneSubtitle,
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  statusFilterOptions,
  showDeleted,
  toggleDeleted,
  rows,
  noRows,
  emptyMessage,
}) {
  return (
    <div style={{ minWidth: 0, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>{paneTitle}</div>
          <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{paneSubtitle}</div>
        </div>
        <div style={{ flex: 1, minWidth: 20 }} />
        <div style={{ minWidth: 170, flex: 1, maxWidth: 280 }}>
          <Input value={search} onChange={onSearch} placeholder="Search name or slug" />
        </div>
        <div style={{ width: 140 }}>
          <Select value={statusFilter} onChange={onStatusFilter} options={statusFilterOptions} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Switch checked={showDeleted} onChange={toggleDeleted} />
          <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Show trashed</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", background: "var(--surface-sunken)", borderBottom: "1px solid var(--border)" }}>
        <span style={{ flex: 1, fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
          Indented rows are children via <span style={{ fontFamily: "var(--font-mono)" }}>parent_category_id</span>. In use counts come from content already pointing at the category.
        </span>
      </div>

      {rows.map((r) => (
        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: `10px 16px 10px ${r.padLeft}`, borderBottom: "1px solid var(--border)", background: r.bg, opacity: r.opacity }}>
          <button
            type="button"
            onClick={r.onToggle}
            aria-label="Expand"
            style={{ flex: "none", width: 20, height: 20, border: "none", background: "transparent", color: r.chevronColor, fontSize: 11, cursor: r.chevronCursor, padding: 0 }}
          >
            {r.chevron}
          </button>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: r.weight, color: "var(--text-primary)" }}>{r.name}</span>
              <Badge tone={r.tone}>{r.status}</Badge>
              {r.isDeleted && <Badge tone="neutral">Trashed</Badge>}
            </div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span style={{ fontFamily: "var(--font-mono)" }}>{r.slug}</span>
              {r.metaTail}
            </div>
          </div>
          <span style={{ flex: "none", fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{r.usageLabel}</span>
          <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <RowActionButton icon={<Icon name="plus" size={15} />} title="Add subcategory" onClick={r.onAddChild} />
            <RowActionButton icon={<Icon name="pencil-square" size={15} />} title="Edit" onClick={r.onEdit} />
            <RowActionButton
              icon={<Icon name={r.trashLabel === "Restore" ? "arrow-uturn-left" : "trash"} size={15} style={r.trashLabel === "Restore" ? undefined : { color: "var(--state-error)" }} />}
              title={r.trashLabel}
              danger={r.trashLabel !== "Restore"}
              onClick={r.onTrash}
            />
          </div>
        </div>
      ))}

      {noRows && <div style={{ padding: "34px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>{emptyMessage}</div>}
    </div>
  );
}
