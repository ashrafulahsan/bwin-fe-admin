"use client";

// Shared list-page pagination footer — Prev/Next plus a page indicator and
// the total item count, backed by a `Page<T>` response's `meta`
// ({page, page_size, total_items, total_pages, has_next, has_previous}).
export default function Pagination({ meta, onPrev, onNext }) {
  if (!meta || meta.total_items === 0) return null;

  const from = (meta.page - 1) * meta.page_size + 1;
  const to = Math.min(meta.page * meta.page_size, meta.total_items);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
        padding: "14px 20px",
        borderTop: "1px solid var(--border)",
        background: "var(--surface-card)",
      }}
    >
      <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
        {from}–{to} of {meta.total_items}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          onClick={onPrev}
          disabled={!meta.has_previous}
          style={{
            padding: "7px 14px",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-card)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body-sm)",
            fontWeight: "var(--fw-medium)",
            cursor: meta.has_previous ? "pointer" : "not-allowed",
            opacity: meta.has_previous ? 1 : 0.5,
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
          Page {meta.page} of {meta.total_pages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!meta.has_next}
          style={{
            padding: "7px 14px",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-card)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body-sm)",
            fontWeight: "var(--fw-medium)",
            cursor: meta.has_next ? "pointer" : "not-allowed",
            opacity: meta.has_next ? 1 : 0.5,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
