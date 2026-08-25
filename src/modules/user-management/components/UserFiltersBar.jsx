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

export default function UserFiltersBar({
  search,
  onSearch,
  roleFilter,
  onRole,
  roleOptions,
  statusFilter,
  onStatus,
  statusOptions,
  verifiedFilter,
  onVerified,
  verifiedOptions,
  loginFilter,
  onLogin,
  loginOptions,
  onResetFilters,
  showDeleted,
  onToggleDeleted,
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
      <FilterField label="Search name, email or phone">
        <Input value={search} onChange={onSearch} placeholder="e.g. Amara, @bwin.com, +8801" />
      </FilterField>
      <FilterField label="Role">
        <Select value={roleFilter} onChange={onRole} options={roleOptions} />
      </FilterField>
      <FilterField label="Status">
        <Select value={statusFilter} onChange={onStatus} options={statusOptions} />
      </FilterField>
      <FilterField label="Verification">
        <Select value={verifiedFilter} onChange={onVerified} options={verifiedOptions} />
      </FilterField>
      <FilterField label="Login type">
        <Select value={loginFilter} onChange={onLogin} options={loginOptions} />
      </FilterField>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
        <button
          type="button"
          onClick={onToggleDeleted}
          style={{
            padding: "9px 14px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            background: showDeleted ? "var(--surface-sunken)" : "transparent",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body-sm)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = showDeleted ? "var(--surface-sunken)" : "transparent")}
        >
          {showDeleted ? "Showing deleted" : "Show deleted"}
        </button>
      </div>
    </div>
  );
}
