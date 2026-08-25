"use client";

import { Button } from "@/components/ui";
import { StatCardsGrid, SearchFiltersBar, Toast, UnderlineTabs } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useNewsletter } from "../hooks";
import CampaignTable from "./CampaignTable";
import SubscriberTable from "./SubscriberTable";
import CampaignDetailView from "./CampaignDetailView";
import CampaignComposeModal from "./CampaignComposeModal";
import AddSubscriberModal from "./AddSubscriberModal";

export default function NewsletterPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const nl = useNewsletter();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {nl.listVisible && (
        <div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>Client communication</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              Newsletter
            </h1>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{nl.resultCount}</span>
            <Button variant="secondary" onClick={nl.exportCsv}>
              Export CSV
            </Button>
            <Button onClick={nl.primaryAction}>{nl.primaryActionLabel}</Button>
          </div>

          <StatCardsGrid stats={nl.stats} />

          <UnderlineTabs tabs={nl.tabs} />

          <SearchFiltersBar
            search={nl.search}
            onSearch={(e) => nl.setSearch(e.target.value)}
            searchLabel={nl.searchLabel}
            searchPlaceholder={nl.searchPlaceholder}
            searchSpan={isMobile ? "auto" : "span 2"}
            selects={[
              { key: "status", label: "Status", value: nl.statusFilter, onChange: (e) => nl.setStatusFilter(e.target.value), options: nl.statusOptions },
              { key: "segment", label: "Segment", value: nl.segmentFilter, onChange: (e) => nl.setSegmentFilter(e.target.value), options: nl.segmentFilterOptions },
              { key: "third", label: nl.thirdFilterLabel, value: nl.thirdFilter, onChange: (e) => nl.setThirdFilter(e.target.value), options: nl.thirdFilterOptions },
            ]}
            onResetFilters={nl.resetFilters}
          />

          {nl.campaignsTab ? (
            <CampaignTable rows={nl.campaignRows} noResults={nl.noCampaigns} darkMode={darkMode} />
          ) : (
            <SubscriberTable rows={nl.subscriberRows} noResults={nl.noSubscribers} statusChangeOptions={nl.subStatusChangeOptions} />
          )}
        </div>
      )}

      {nl.detailVisible && (
        <CampaignDetailView detail={nl.detail} detailMetrics={nl.detailMetrics} detailFields={nl.detailFields} onClose={nl.closeDetail} onEdit={nl.editFromDetail} />
      )}

      {nl.composeOpen && (
        <CampaignComposeModal
          title={nl.composeTitle}
          subtitle={nl.composeSubtitle}
          form={nl.form}
          onFieldChange={nl.setFormField}
          segmentOptions={nl.segmentOptions}
          segmentReach={nl.segmentReach}
          formError={nl.formError}
          submitLabel={nl.submitLabel}
          onClose={nl.closeCompose}
          onSendTest={nl.sendTest}
          onSaveDraft={nl.saveDraft}
          onSubmit={nl.submitCompose}
        />
      )}

      {nl.addOpen && (
        <AddSubscriberModal form={nl.subForm} onFieldChange={nl.setSubFormField} segmentOptions={nl.segmentOptions} formError={nl.subFormError} onClose={nl.closeAdd} onSubmit={nl.submitAdd} />
      )}

      <Toast message={nl.toast} />
    </div>
  );
}
