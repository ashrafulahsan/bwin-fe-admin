"use client";

import { Button } from "@/components/ui";
import { StatCardsGrid, SearchFiltersBar } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useAutomations } from "../hooks";
import AutomationTable from "./AutomationTable";
import AutomationDetailModal from "./AutomationDetailModal";
import AutomationForm from "./AutomationForm";

export default function AutomationPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const automations = useAutomations();

  const isListView = automations.view === "list";
  const titleSize = isMobile ? "24px" : "32px";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>
        {isListView ? "Business automation" : "Business automation · Automations"}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: titleSize, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {isListView ? "Automations" : automations.editing ? "Edit automation" : "New automation"}
        </h1>
        <div style={{ flex: 1 }} />
        {isListView ? (
          <>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{automations.resultCount}</span>
            <Button variant="secondary" onClick={automations.exportCsv}>
              Export CSV
            </Button>
            <Button variant="accent" onClick={automations.openNew}>
              New automation
            </Button>
          </>
        ) : (
          <>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {automations.editing ? `/${automations.editing.slug}` : "new record"}
            </span>
            <Button variant="secondary" onClick={automations.cancelForm}>
              Back to list
            </Button>
          </>
        )}
      </div>

      {!isListView && (
        <AutomationForm
          key={automations.editing?.id ?? "new"}
          editing={automations.editing}
          form={automations.form}
          onFieldChange={automations.setFormField}
          advancedOpen={automations.advancedOpen}
          onToggleAdvanced={automations.toggleAdvanced}
          formError={automations.formError}
          onCancel={automations.cancelForm}
          onSaveDraft={automations.saveDraft}
          onSavePublish={automations.savePublish}
        />
      )}

      {isListView && (
        <>
          <StatCardsGrid stats={automations.stats} />

          {automations.notice && (
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
              <span>{automations.notice}</span>
              <span style={{ flex: 1 }} />
              <button onClick={automations.dismissNotice} style={{ border: "none", background: "transparent", color: "inherit", fontSize: 14, cursor: "pointer", lineHeight: 1 }}>
                ✕
              </button>
            </div>
          )}

          <SearchFiltersBar
            search={automations.search}
            onSearch={(e) => automations.setSearch(e.target.value)}
            searchLabel="Search title or slug"
            searchPlaceholder="e.g. invoice, lead routing"
            selects={automations.filterSelects}
            onResetFilters={automations.resetFilters}
            showDeleted={automations.showDeleted}
            onToggleDeleted={automations.toggleShowDeleted}
          />

          <AutomationTable
            rows={automations.filtered}
            noResults={automations.noResults}
            darkMode={darkMode}
            onView={automations.onView}
            onEdit={automations.onEdit}
            onDuplicate={automations.onDuplicate}
            onPublish={automations.onPublish}
            onDelete={automations.onDelete}
          />
        </>
      )}

      <AutomationDetailModal automation={automations.current} onClose={automations.closeDetail} onEdit={automations.editFromDetail} />
    </div>
  );
}
