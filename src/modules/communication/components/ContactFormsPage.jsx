"use client";

import { Button } from "@/components/ui";
import { StatCardsGrid, SearchFiltersBar } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useContactForms } from "../hooks";
import ContactTable from "./ContactTable";
import ContactDetailModal from "./ContactDetailModal";

export default function ContactFormsPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const cf = useContactForms();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>Client communication</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          Contact forms
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{cf.resultCount}</span>
        <Button variant="secondary" onClick={cf.exportCsv}>
          Export CSV
        </Button>
      </div>

      <StatCardsGrid stats={cf.stats} onSelect={cf.setStatusFilter} activeKey={cf.statusFilter} />

      <SearchFiltersBar
        search={cf.search}
        onSearch={(e) => cf.setSearch(e.target.value)}
        searchLabel="Search name, email, phone or message"
        searchPlaceholder="e.g. Amara, fleet, +234"
        searchSpan={isMobile ? "auto" : "span 2"}
        selects={[
          { key: "interest", label: "Interested in", value: cf.interestFilter, onChange: (e) => cf.setInterestFilter(e.target.value), options: cf.interestOptions },
          { key: "status", label: "Status", value: cf.statusFilter, onChange: (e) => cf.setStatusFilter(e.target.value), options: cf.statusOptions },
          { key: "range", label: "Received", value: cf.rangeFilter, onChange: (e) => cf.setRangeFilter(e.target.value), options: cf.rangeOptions },
        ]}
        onResetFilters={cf.resetFilters}
      />

      <ContactTable rows={cf.filtered} noResults={cf.noResults} statusChangeOptions={cf.statusChangeOptions} onStatusChange={cf.setRowStatus} onView={cf.openDetail} />

      <ContactDetailModal
        draft={cf.draft}
        statusLabels={cf.statusLabels}
        statusTones={cf.statusTones}
        statusChangeOptions={cf.statusChangeOptions}
        assigneeOptions={cf.assigneeOptions}
        onFieldChange={cf.setDraftField}
        onClose={cf.closeDetail}
        onReplyByEmail={cf.replyByEmail}
        onSave={cf.saveDetail}
      />
    </div>
  );
}
