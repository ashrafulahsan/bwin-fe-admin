"use client";

import { Input, Select } from "@/components/ui";

const captionStyle = { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

function FilterField({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={captionStyle}>{label}</span>
      {children}
    </div>
  );
}

export default function ActivityLogFiltersBar({
  search,
  onSearch,
  moduleFilter,
  onModule,
  moduleOptions,
  actionFilter,
  onAction,
  actionOptions,
  statusFilter,
  onStatus,
  statusOptions,
  rangeFilter,
  onRange,
  rangeOptions,
  onResetFilters,
}) {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
        padding: "16px 20px",
        marginBottom: 16,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px 16px",
        alignItems: "end",
      }}
    >
      <FilterField label="Search user or description">
        <Input value={search} onChange={onSearch} placeholder="e.g. Amara, ticket, course" />
      </FilterField>
      <FilterField label="Module">
        <Select value={moduleFilter} onChange={onModule} options={moduleOptions} />
      </FilterField>
      <FilterField label="Action">
        <Select value={actionFilter} onChange={onAction} options={actionOptions} />
      </FilterField>
      <FilterField label="Status">
        <Select value={statusFilter} onChange={onStatus} options={statusOptions} />
      </FilterField>
      <FilterField label="Date range">
        <Select value={rangeFilter} onChange={onRange} options={rangeOptions} />
      </FilterField>

      <div>
        <button
          type="button"
          onClick={onResetFilters}
          style={{
            padding: "9px 14px",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-card)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body-sm)",
            fontWeight: "var(--fw-medium)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}
