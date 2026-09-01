"use client";

import { Button } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { useList } from "../hooks";
import ListCategoryPane from "./ListCategoryPane";
import ListEntriesPane from "./ListEntriesPane";
import ListEntryFormModal from "./ListEntryFormModal";
import ListFieldFormModal from "./ListFieldFormModal";

export default function ListPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const l = useList();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>CMS</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          List
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{l.countLine}</span>
        <button
          type="button"
          onClick={l.openNewField}
          style={{ padding: "10px 14px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
        >
          New field
        </button>
        <Button onClick={l.openNewEntry}>{l.newEntryLabel}</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,300px) minmax(0,1fr)", gap: 16, alignItems: "start" }}>
        <ListCategoryPane categories={l.categoryRows} />
        <ListEntriesPane
          paneTitle={l.paneTitle}
          paneSubtitle={l.paneSubtitle}
          onEntries={l.onEntries}
          onFields={l.onFields}
          showEntriesTab={l.showEntriesTab}
          showFieldsTab={l.showFieldsTab}
          fieldsTabLabel={l.fieldsTabLabel}
          entriesTabBg={l.entriesTabBg}
          entriesTabColor={l.entriesTabColor}
          fieldsTabBg={l.fieldsTabBg}
          fieldsTabColor={l.fieldsTabColor}
          search={l.search}
          onSearch={(e) => l.setSearch(e.target.value)}
          statusFilter={l.statusFilter}
          onStatusFilter={(e) => l.setStatusFilter(e.target.value)}
          statusFilterOptions={l.statusFilterOptions}
          showDeleted={l.showDeleted}
          toggleDeleted={l.toggleDeleted}
          entryRows={l.entryRows}
          noEntries={l.noEntries}
          emptyMessage={l.emptyMessage}
          fieldRows={l.fieldRows}
          noFields={l.noFields}
        />
      </div>

      {l.entryFormOpen && (
        <ListEntryFormModal
          title={l.entryFormTitle}
          subtitle={l.entryFormSubtitle}
          form={l.entryForm}
          onTitle={l.onEntryTitle}
          onSlug={l.onEntrySlug}
          onCategory={l.onEntryCategory}
          categoryOptions={l.categoryOptions}
          onLink={l.onEntryLink}
          onDescription={l.onEntryDescription}
          onOrder={l.onEntryOrder}
          onStatus={l.onEntryStatus}
          statusOptions={l.statusOptions}
          hasCustomFields={l.hasCustomFields}
          customFieldsHeading={l.customFieldsHeading}
          formFields={l.formFields}
          formError={l.formError}
          meta={l.entryFormMeta}
          saveLabel={l.entrySaveLabel}
          onClose={l.closeForms}
          onSubmit={l.saveEntry}
        />
      )}

      {l.fieldFormOpen && (
        <ListFieldFormModal
          title={l.fieldFormTitle}
          subtitle={l.fieldFormSubtitle}
          form={l.fieldForm}
          onName={l.onFieldName}
          onType={l.onFieldType}
          fieldTypeOptions={l.fieldTypeOptions}
          onCategory={l.onFieldCategory}
          categoryOptions={l.categoryOptions}
          onStatus={l.onFieldStatus}
          statusOptions={l.statusOptions}
          fieldNeedsOptions={l.fieldNeedsOptions}
          onOptions={l.onFieldOptions}
          onRequired={l.onFieldRequired}
          formError={l.formError}
          meta={l.fieldFormMeta}
          saveLabel={l.fieldSaveLabel}
          onClose={l.closeForms}
          onSubmit={l.saveField}
        />
      )}
    </div>
  );
}
