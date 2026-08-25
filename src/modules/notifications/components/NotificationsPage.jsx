"use client";

import { Button } from "@/components/ui";
import { StatCardsGrid, SearchFiltersBar, Toast, UnderlineTabs } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useNotifications } from "../hooks";
import NotificationTable from "./NotificationTable";
import NotificationDetailView from "./NotificationDetailView";
import NotificationCreateModal from "./NotificationCreateModal";

export default function NotificationsPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const n = useNotifications();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {n.listVisible && (
        <div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>Client communication</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              Notification
            </h1>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{n.resultCount}</span>
            <Button onClick={n.openCreate}>New notification</Button>
          </div>

          <StatCardsGrid stats={n.stats} />

          <UnderlineTabs tabs={n.tabs} />

          <SearchFiltersBar
            search={n.search}
            onSearch={(e) => n.setSearch(e.target.value)}
            searchLabel="Search title, message or ID"
            searchPlaceholder="e.g. maintenance, certificates, NT-2091"
            searchSpan={isMobile ? "auto" : "span 2"}
            selects={[
              { key: "category", label: "Category", value: n.categoryFilter, onChange: (e) => n.setCategoryFilter(e.target.value), options: n.categoryOptions },
              { key: "audience", label: "Audience", value: n.audienceFilter, onChange: (e) => n.setAudienceFilter(e.target.value), options: n.audienceFilterOptions },
              { key: "status", label: "Status", value: n.statusFilter, onChange: (e) => n.setStatusFilter(e.target.value), options: n.statusOptions },
            ]}
            onResetFilters={n.resetFilters}
          />

          <NotificationTable rows={n.rows} noResults={n.noResults} darkMode={darkMode} onView={n.viewNotification} />
        </div>
      )}

      {n.detailVisible && (
        <NotificationDetailView detail={n.detail} detailMetrics={n.detailMetrics} detailFields={n.detailFields} onClose={n.closeDetail} />
      )}

      {n.createOpen && (
        <NotificationCreateModal
          form={n.form}
          onFieldChange={n.setFormField}
          audienceOptions={n.audienceOptions}
          channelOptions={n.channelOptions}
          formCategoryOptions={n.formCategoryOptions}
          priorityOptions={n.priorityOptions}
          formError={n.formError}
          submitLabel={n.submitLabel}
          onClose={n.closeCreate}
          onSaveDraft={n.saveDraft}
          onSubmit={n.submitCreate}
        />
      )}

      <Toast message={n.toast} />
    </div>
  );
}
