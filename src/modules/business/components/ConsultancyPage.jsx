"use client";

import { Button } from "@/components/ui";
import { StatCardsGrid, SearchFiltersBar } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useConsultancies } from "../hooks";
import ConsultancyTable from "./ConsultancyTable";
import ConsultancyDetailModal from "./ConsultancyDetailModal";
import ConsultancyForm from "./ConsultancyForm";

export default function ConsultancyPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const consultancies = useConsultancies();

  const isListView = consultancies.view === "list";
  const titleSize = isMobile ? "24px" : "32px";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>
        {isListView ? "Consultancy service" : "Consultancy service · Services"}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: titleSize, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {isListView ? "Consultancy services" : consultancies.editing ? "Edit consultancy" : "New consultancy"}
        </h1>
        <div style={{ flex: 1 }} />
        {isListView ? (
          <>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{consultancies.resultCount}</span>
            <Button variant="secondary" onClick={consultancies.exportCsv}>
              Export CSV
            </Button>
            <Button variant="accent" onClick={consultancies.openNew}>
              New consultancy
            </Button>
          </>
        ) : (
          <>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {consultancies.editing ? consultancies.editing.consultancy_code : "new record"}
            </span>
            <Button variant="secondary" onClick={consultancies.cancelForm}>
              Back to list
            </Button>
          </>
        )}
      </div>

      {!isListView && (
        <ConsultancyForm
          key={consultancies.editing?.id ?? "new"}
          editing={consultancies.editing}
          form={consultancies.form}
          onFieldChange={consultancies.setFormField}
          advancedOpen={consultancies.advancedOpen}
          onToggleAdvanced={consultancies.toggleAdvanced}
          formError={consultancies.formError}
          onCancel={consultancies.cancelForm}
          onSaveDraft={consultancies.saveDraft}
          onSaveActive={consultancies.saveActive}
        />
      )}

      {isListView && (
        <>
          <StatCardsGrid stats={consultancies.stats} />

          {consultancies.notice && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                background: "var(--state-success-bg)",
                color: "var(--state-success)",
                fontSize: "var(--fs-body-sm)",
              }}
            >
              <span>{consultancies.notice}</span>
              <span style={{ flex: 1 }} />
              <button onClick={consultancies.dismissNotice} style={{ border: "none", background: "transparent", color: "inherit", fontSize: 14, cursor: "pointer", lineHeight: 1 }}>
                ✕
              </button>
            </div>
          )}

          <SearchFiltersBar
            search={consultancies.search}
            onSearch={(e) => consultancies.setSearch(e.target.value)}
            searchLabel="Search title, code or slug"
            searchPlaceholder="e.g. strategy, BWIN-CS"
            selects={consultancies.filterSelects}
            onResetFilters={consultancies.resetFilters}
            showDeleted={consultancies.showDeleted}
            onToggleDeleted={consultancies.toggleShowDeleted}
          />

          <ConsultancyTable
            rows={consultancies.filtered}
            noResults={consultancies.noResults}
            darkMode={darkMode}
            onView={consultancies.onView}
            onEdit={consultancies.onEdit}
            onDuplicate={consultancies.onDuplicate}
            onToggleStatus={consultancies.onToggleStatus}
            onDelete={consultancies.onDelete}
          />
        </>
      )}

      <ConsultancyDetailModal consultancy={consultancies.current} onClose={consultancies.closeDetail} onEdit={consultancies.editFromDetail} />
    </div>
  );
}
