"use client";

import { Input, Select, Switch } from "@/components/ui";

export default function ArticleFiltersBar({
  search,
  onSearch,
  categoryFilter,
  onCategoryFilter,
  categoryFilterOptions,
  statusFilter,
  onStatusFilter,
  statusFilterOptions,
  authorFilter,
  onAuthorFilter,
  authorFilterOptions,
  sort,
  onSort,
  sortOptions,
  featuredOnly,
  toggleFeatured,
  showDeleted,
  toggleDeleted,
  filtersDirty,
  clearFilters,
}) {
  return (
    <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <div style={{ minWidth: 180, flex: 1, maxWidth: 320 }}>
        <Input value={search} onChange={onSearch} placeholder="Search title, slug or excerpt" />
      </div>
      <div style={{ width: 170 }}>
        <Select value={categoryFilter} onChange={onCategoryFilter} options={categoryFilterOptions} />
      </div>
      <div style={{ width: 150 }}>
        <Select value={statusFilter} onChange={onStatusFilter} options={statusFilterOptions} />
      </div>
      <div style={{ width: 160 }}>
        <Select value={authorFilter} onChange={onAuthorFilter} options={authorFilterOptions} />
      </div>
      <div style={{ width: 150 }}>
        <Select value={sort} onChange={onSort} options={sortOptions} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Switch checked={featuredOnly} onChange={toggleFeatured} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Featured only</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Switch checked={showDeleted} onChange={toggleDeleted} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Show trashed</span>
      </div>
      {filtersDirty && (
        <button
          type="button"
          onClick={clearFilters}
          style={{ padding: "9px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
