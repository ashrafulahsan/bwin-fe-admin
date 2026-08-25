"use client";

import { Button } from "@/components/ui";
import { StatCardsGrid, SearchFiltersBar, Toast } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useSupportTickets } from "../hooks";
import TicketTable from "./TicketTable";
import TicketDetailModal from "./TicketDetailModal";

export default function SupportTicketsPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const t = useSupportTickets();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>Client communication</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          Support tickets
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{t.resultCount}</span>
        <Button variant="secondary" onClick={t.exportCsv}>
          Export CSV
        </Button>
      </div>

      <StatCardsGrid stats={t.stats} />

      <SearchFiltersBar
        search={t.search}
        onSearch={(e) => t.setSearch(e.target.value)}
        searchLabel="Search ticket, subject or student"
        searchPlaceholder="e.g. TCK-3182, refund, Elena"
        searchSpan={isMobile ? "auto" : "span 2"}
        selects={[
          { key: "status", label: "Status", value: t.statusFilter, onChange: (e) => t.setStatusFilter(e.target.value), options: t.statusOptions },
          { key: "priority", label: "Priority", value: t.priorityFilter, onChange: (e) => t.setPriorityFilter(e.target.value), options: t.priorityOptions },
          { key: "category", label: "Category", value: t.categoryFilter, onChange: (e) => t.setCategoryFilter(e.target.value), options: t.categoryOptions },
        ]}
        onResetFilters={t.resetFilters}
      />

      <TicketTable rows={t.rows} noResults={t.noResults} statusChangeOptions={t.statusChangeOptions} assigneeOptions={t.assigneeOptions} />

      {t.detailOpen && (
        <TicketDetailModal
          detail={t.detail}
          detailFields={t.detailFields}
          replyDraft={t.replyDraft}
          onReplyChange={t.onReplyChange}
          replyIsNote={t.replyIsNote}
          onReplyNoteToggle={t.onReplyNoteToggle}
          sendReply={t.sendReply}
          statusChangeOptions={t.statusChangeOptions}
          assigneeOptions={t.assigneeOptions}
          onDetailStatus={t.onDetailStatus}
          onDetailAssignee={t.onDetailAssignee}
          escalateLabel={t.escalateLabel}
          toggleEscalate={t.toggleEscalate}
          saveDetail={t.saveDetail}
          onClose={t.closeDetail}
        />
      )}

      <Toast message={t.toast} />
    </div>
  );
}
