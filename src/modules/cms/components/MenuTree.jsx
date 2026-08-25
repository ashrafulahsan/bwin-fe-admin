"use client";

import { Badge, Button, Input, Switch } from "@/components/ui";

function IconBtn({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={{ width: 26, height: 26, border: "1px solid var(--border)", borderRadius: "var(--radius-xs)", background: "var(--surface-card)", color: "var(--text-secondary)", fontSize: 11, cursor: disabled ? "default" : "pointer", padding: 0 }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = "var(--surface-sunken)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
    >
      {children}
    </button>
  );
}

function SmallBtn({ color, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ padding: "5px 9px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: color || "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
    >
      {children}
    </button>
  );
}

export default function MenuTree({
  search,
  onSearch,
  expandAll,
  collapseAll,
  showDeleted,
  toggleDeleted,
  dirty,
  revertOrder,
  saveOrder,
  rows,
  noRows,
  emptyMessage,
  rootDropBg,
  onRootDragOver,
  onRootDrop,
}) {
  return (
    <div style={{ minWidth: 0, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ minWidth: 180, flex: 1 }}>
          <Input value={search} onChange={onSearch} placeholder="Search title or link" />
        </div>
        <SmallBtnLg onClick={expandAll}>Expand all</SmallBtnLg>
        <SmallBtnLg onClick={collapseAll}>Collapse all</SmallBtnLg>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Switch checked={showDeleted} onChange={toggleDeleted} />
          <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Show trashed</span>
        </div>
      </div>

      <div style={{ padding: "9px 18px", background: "var(--surface-sunken)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
          Drag a row onto another to nest it, or between rows to reorder. <span style={{ fontFamily: "var(--font-mono)" }}>order</span> renumbers per parent.
        </span>
        <div style={{ flex: 1 }} />
        {dirty && <SmallBtn onClick={revertOrder}>Revert</SmallBtn>}
        {dirty && (
          <Button size="sm" onClick={saveOrder}>
            Save order
          </Button>
        )}
      </div>

      {rows.map((row) => (
        <div
          key={row.id}
          draggable
          onDragStart={row.onDragStart}
          onDragOver={row.onDragOver}
          onDragLeave={row.onDragLeave}
          onDrop={row.onDrop}
          onDragEnd={row.onDragEnd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: `9px 16px 9px ${row.padLeft}`,
            borderTop: `2px solid ${row.topLine}`,
            borderBottom: `1px solid ${row.bottomLine}`,
            background: row.bg,
            opacity: row.opacity,
            cursor: "grab",
          }}
        >
          <span style={{ flex: "none", width: 14, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1 }}>⠿</span>
          <button
            type="button"
            onClick={row.onToggle}
            aria-label="Expand"
            style={{ flex: "none", width: 20, height: 20, border: "none", background: "transparent", color: row.chevronColor, fontSize: 11, cursor: row.chevronCursor, padding: 0 }}
          >
            {row.chevron}
          </button>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: row.titleWeight, color: "var(--text-primary)" }}>{row.title}</span>
              {row.hasChildren && <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.childLabel}</span>}
              {row.noLink && <Badge tone="warning">No link</Badge>}
              {row.isDeleted && <Badge tone="neutral">Trashed</Badge>}
            </div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span style={{ fontFamily: "var(--font-mono)" }}>{row.linkLabel}</span>
              {row.metaTail}
            </div>
          </div>
          <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)", width: 28, textAlign: "right" }}>{row.orderLabel}</span>
            <IconBtn label="Move up" onClick={row.onUp}>↑</IconBtn>
            <IconBtn label="Move down" onClick={row.onDown}>↓</IconBtn>
            <IconBtn label="Nest under previous" onClick={row.onIndent}>→</IconBtn>
            <IconBtn label="Move out one level" onClick={row.onOutdent}>←</IconBtn>
            <SmallBtn onClick={row.onAddChild}>Submenu</SmallBtn>
            <SmallBtn onClick={row.onEdit}>Edit</SmallBtn>
            <SmallBtn color={row.trashColor} onClick={row.onTrash}>
              {row.trashLabel}
            </SmallBtn>
          </div>
        </div>
      ))}

      {noRows && <div style={{ padding: "34px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>{emptyMessage}</div>}

      <div onDragOver={onRootDragOver} onDrop={onRootDrop} style={{ padding: "12px 18px", borderTop: "1px solid var(--border)", background: rootDropBg, fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
        Drop here to move an item to the top level
      </div>
    </div>
  );
}

function SmallBtnLg({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ padding: "9px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
    >
      {children}
    </button>
  );
}
