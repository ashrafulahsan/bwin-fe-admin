"use client";

import { Input, Select, Switch } from "@/components/ui";
import ListEntryRows from "./ListEntryRows";
import ListFieldRows from "./ListFieldRows";

export default function ListEntriesPane({
  paneTitle,
  paneSubtitle,
  onEntries,
  onFields,
  showEntriesTab,
  showFieldsTab,
  fieldsTabLabel,
  entriesTabBg,
  entriesTabColor,
  fieldsTabBg,
  fieldsTabColor,
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  statusFilterOptions,
  showDeleted,
  toggleDeleted,
  entryRows,
  noEntries,
  emptyMessage,
  fieldRows,
  noFields,
}) {
  return (
    <div style={{ minWidth: 0, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>{paneTitle}</div>
          <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{paneSubtitle}</div>
        </div>
        <div style={{ flex: 1, minWidth: 12 }} />
        <div style={{ display: "flex", gap: 2, padding: 3, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-sunken)" }}>
          <button
            type="button"
            onClick={showEntriesTab}
            style={{ padding: "7px 13px", border: "none", borderRadius: "var(--radius-xs)", background: entriesTabBg, color: entriesTabColor, fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}
          >
            Entries
          </button>
          <button
            type="button"
            onClick={showFieldsTab}
            style={{ padding: "7px 13px", border: "none", borderRadius: "var(--radius-xs)", background: fieldsTabBg, color: fieldsTabColor, fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}
          >
            {fieldsTabLabel}
          </button>
        </div>
      </div>

      {onEntries && (
        <>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ minWidth: 170, flex: 1, maxWidth: 300 }}>
              <Input value={search} onChange={onSearch} placeholder="Search title, slug or field value" />
            </div>
            <div style={{ width: 150 }}>
              <Select value={statusFilter} onChange={onStatusFilter} options={statusFilterOptions} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Switch checked={showDeleted} onChange={toggleDeleted} />
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Show trashed</span>
            </div>
          </div>

          <ListEntryRows rows={entryRows} noEntries={noEntries} emptyMessage={emptyMessage} />
        </>
      )}

      {onFields && <ListFieldRows rows={fieldRows} noFields={noFields} />}
    </div>
  );
}
