"use client";

import { Button } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { useTaxonomy } from "../hooks";
import CategoryTypesList from "./CategoryTypesList";
import CategoryTree from "./CategoryTree";
import CategoryTypeFormModal from "./CategoryTypeFormModal";
import CategoryFormModal from "./CategoryFormModal";

export default function TaxonomyPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const t = useTaxonomy();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>CMS</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          Category &amp; tag
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{t.countLine}</span>
        <button
          type="button"
          onClick={t.openNewType}
          style={{ padding: "10px 14px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
        >
          New category type
        </button>
        <Button onClick={t.openNewCategory}>New category</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,340px) minmax(0,1fr)", gap: 16, alignItems: "start" }}>
        <CategoryTypesList types={t.typeRows} />
        <CategoryTree
          paneTitle={t.paneTitle}
          paneSubtitle={t.paneSubtitle}
          search={t.search}
          onSearch={(e) => t.setSearch(e.target.value)}
          statusFilter={t.statusFilter}
          onStatusFilter={(e) => t.setStatusFilter(e.target.value)}
          statusFilterOptions={t.statusFilterOptions}
          showDeleted={t.showDeleted}
          toggleDeleted={t.toggleDeleted}
          rows={t.rows}
          noRows={t.noRows}
          emptyMessage={t.emptyMessage}
        />
      </div>

      {t.typeFormOpen && (
        <CategoryTypeFormModal
          title={t.typeFormTitle}
          form={t.typeForm}
          onName={t.onTypeName}
          onSlug={t.onTypeSlug}
          onDescription={t.onTypeDescription}
          onStatus={t.onTypeStatus}
          statusOptions={t.statusOptions}
          formError={t.formError}
          meta={t.typeFormMeta}
          saveLabel={t.typeSaveLabel}
          onClose={t.closeForms}
          onSubmit={t.saveType}
        />
      )}

      {t.catFormOpen && (
        <CategoryFormModal
          title={t.catFormTitle}
          subtitle={t.catFormSubtitle}
          form={t.catForm}
          onName={t.onCatName}
          onSlug={t.onCatSlug}
          onType={t.onCatType}
          typeOptions={t.typeOptions}
          onParent={t.onCatParent}
          parentOptions={t.parentOptions}
          onDescription={t.onCatDescription}
          onStatus={t.onCatStatus}
          statusOptions={t.statusOptions}
          formError={t.formError}
          meta={t.catFormMeta}
          saveLabel={t.catSaveLabel}
          onClose={t.closeForms}
          onSubmit={t.saveCategory}
        />
      )}
    </div>
  );
}
