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

export default function RoleFiltersBar({
  isRolesTab,
  search,
  onSearch,
  permFilter,
  onPerm,
  permOptions,
  levelFilter,
  onLevel,
  levelOptions,
  resourceFilter,
  onResource,
  resourceOptions,
  actionFilter,
  onAction,
  actionOptions,
  systemFilter,
  onSystem,
  systemOptions,
  onResetFilters,
  resultCount,
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
      <FilterField label={isRolesTab ? "Search role name or slug" : "Search code or name"}>
        <Input value={search} onChange={onSearch} placeholder={isRolesTab ? "e.g. content, manager" : "e.g. cms.manage, upload"} />
      </FilterField>

      {isRolesTab ? (
        <>
          <FilterField label="Permission">
            <Select value={permFilter} onChange={onPerm} options={permOptions} />
          </FilterField>
          <FilterField label="Level">
            <Select value={levelFilter} onChange={onLevel} options={levelOptions} />
          </FilterField>
        </>
      ) : (
        <>
          <FilterField label="Resource">
            <Select value={resourceFilter} onChange={onResource} options={resourceOptions} />
          </FilterField>
          <FilterField label="Action">
            <Select value={actionFilter} onChange={onAction} options={actionOptions} />
          </FilterField>
        </>
      )}

      <FilterField label="Type">
        <Select value={systemFilter} onChange={onSystem} options={systemOptions} />
      </FilterField>

      <div style={{ display: "flex", alignItems: "end", gap: 8 }}>
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
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
          {resultCount}
        </span>
      </div>
    </div>
  );
}
