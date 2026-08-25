"use client";

import { Button } from "@/components/ui";
import { SearchFiltersBar, Toast, ConfirmDialog } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useAnnouncements } from "../hooks";
import SlotPreviewGrid from "./SlotPreviewGrid";
import LivePreviewPanel from "./LivePreviewPanel";
import AnnouncementTable from "./AnnouncementTable";
import AnnouncementFormModal from "./AnnouncementFormModal";

export default function AnnouncementsPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const a = useAnnouncements();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>Client communication</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          Announcement
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{a.resultCount}</span>
        <Button onClick={a.openCreate}>New announcement</Button>
      </div>

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: a.liveDot }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 15, color: "var(--text-primary)" }}>{a.liveHeading}</span>
          <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{a.liveSubtitle}</span>
          <div style={{ flex: 1 }} />
          {a.hasLive && (
            <button
              type="button"
              onClick={a.deactivateLive}
              style={{ padding: "8px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
            >
              Turn off
            </button>
          )}
        </div>

        <SlotPreviewGrid slots={a.slots} />

        {a.hasLive && <LivePreviewPanel live={a.live} liveMetrics={a.liveMetrics} />}

        {a.noLive && (
          <div style={{ padding: 20, border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-sm)", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
            {a.emptySlotMessage}
          </div>
        )}
      </div>

      <SearchFiltersBar
        search={a.search}
        onSearch={(e) => a.setSearch(e.target.value)}
        searchLabel="Search title, content or ID"
        searchPlaceholder="e.g. cohorts, maintenance, AN-410"
        searchSpan={isMobile ? "auto" : "span 2"}
        selects={[
          { key: "placement", label: "Placement", value: a.placementFilter, onChange: (e) => a.setPlacementFilter(e.target.value), options: a.placementFilterOptions },
          { key: "type", label: "Content", value: a.typeFilter, onChange: (e) => a.setTypeFilter(e.target.value), options: a.typeFilterOptions },
          { key: "state", label: "State", value: a.stateFilter, onChange: (e) => a.setStateFilter(e.target.value), options: a.stateOptions },
        ]}
        onResetFilters={a.resetFilters}
      />

      <AnnouncementTable rows={a.rows} noResults={a.noResults} />

      {a.formOpen && (
        <AnnouncementFormModal
          title={a.formTitle}
          subtitle={a.formSubtitle}
          form={a.form}
          onFieldChange={a.setFormField}
          placementChoices={a.placementChoices}
          typeOptions={a.typeOptions}
          toneOptions={a.toneOptions}
          audienceOptions={a.audienceOptions}
          formIsText={a.formIsText}
          formIsImage={a.formIsImage}
          formHasImage={a.formHasImage}
          formNoImage={a.formNoImage}
          replaceWarning={a.replaceWarning}
          formError={a.formError}
          submitLabel={a.submitLabel}
          onClose={a.closeForm}
          onSubmit={a.submitForm}
        />
      )}

      <ConfirmDialog
        open={a.deleteOpen}
        title="Delete this announcement?"
        message={a.deleteMessage}
        cancelLabel="Keep it"
        confirmLabel="Delete"
        onCancel={a.cancelDelete}
        onConfirm={a.confirmDelete}
      />

      <Toast message={a.toast} />
    </div>
  );
}
