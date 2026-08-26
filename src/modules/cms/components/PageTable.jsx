"use client";

import { Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";

const GRID_COLUMNS = "minmax(0,2.2fr) minmax(0,1fr) minmax(0,0.8fr) minmax(200px,0.9fr)";
const headerCellStyle = { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", letterSpacing: "0.02em" };

export default function PageTable({ rows, noRows, emptyMessage }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 14, alignItems: "center", padding: "10px 18px", background: "var(--surface-sunken)", borderBottom: "1px solid var(--border)" }}>
        <span style={headerCellStyle}>Page</span>
        <span style={headerCellStyle}>URL &amp; SEO</span>
        <span style={headerCellStyle}>Status</span>
        <span style={{ ...headerCellStyle, textAlign: "right" }}>Actions</span>
      </div>

      {rows.map((p) => (
        <div key={p.id} style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 14, alignItems: "start", padding: "14px 18px", borderBottom: "1px solid var(--border)", opacity: p.opacity }}>
          <div style={{ minWidth: 0, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div
              style={{
                flex: "none",
                width: 104,
                height: 70,
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xs)",
                backgroundColor: "var(--surface-sunken)",
                backgroundImage: p.thumbCss,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 6,
                boxSizing: "border-box",
                textAlign: "center",
                fontSize: 10,
                lineHeight: 1.35,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                overflow: "hidden",
              }}
            >
              {p.thumbLabel}
            </div>
            <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: "var(--fs-body-md)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>{p.title}</span>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</span>
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.metaTail}</span>
            </div>
          </div>

          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.path}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {p.tags.map((tag, i) => (
                <span key={i} style={{ padding: "2px 9px", border: "1px solid var(--border)", borderRadius: 999, background: "var(--surface-sunken)", fontSize: "var(--fs-caption)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                  {tag.label}
                </span>
              ))}
            </div>
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{p.robots}</span>
          </div>

          <div style={{ minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 6 }}>
            <Badge tone={p.tone}>{p.status}</Badge>
            {p.isFeatured && <Badge tone="brand">Featured</Badge>}
            {p.isDeleted && <Badge tone="neutral">Trashed</Badge>}
            {p.seoWeak && <Badge tone="warning">{p.seoLabel}</Badge>}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
            <RowActionButton icon={<Icon name={p.primaryIcon} size={15} />} title={p.primaryLabel} onClick={p.onPrimary} />
            <RowActionButton icon={<Icon name="star" size={15} style={p.isFeatured ? { color: "var(--orange-500)" } : undefined} />} title={p.featureLabel} onClick={p.onFeature} />
            <RowActionButton icon={<Icon name="pencil-square" size={15} />} title="Edit" onClick={p.onEdit} />
            <RowActionButton icon={<Icon name="document-duplicate" size={15} />} title="Duplicate" onClick={p.onDuplicate} />
            <RowActionButton
              icon={<Icon name={p.trashLabel === "Restore" ? "arrow-uturn-left" : "trash"} size={15} style={p.trashLabel === "Restore" ? undefined : { color: "var(--state-error)" }} />}
              title={p.trashLabel}
              danger={p.trashLabel !== "Restore"}
              onClick={p.onTrash}
            />
          </div>
        </div>
      ))}

      {noRows && <div style={{ padding: "36px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>{emptyMessage}</div>}
    </>
  );
}
