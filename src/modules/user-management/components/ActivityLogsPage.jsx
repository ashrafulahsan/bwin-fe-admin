"use client";

import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useActivityLogs } from "../hooks";
import ActivityLogFiltersBar from "./ActivityLogFiltersBar";
import ActivityLogTable from "./ActivityLogTable";
import ActivityLogDetailModal from "./ActivityLogDetailModal";

export default function ActivityLogsPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const al = useActivityLogs();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>Users</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontWeight: "var(--fw-bold)",
            fontSize: isMobile ? "24px" : "32px",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          Activity logs
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {al.filtered.length} of {al.logs.length} entries
        </span>
      </div>

      <ActivityLogFiltersBar
        search={al.search}
        onSearch={(e) => al.setSearch(e.target.value)}
        moduleFilter={al.moduleFilter}
        onModule={(e) => al.setModuleFilter(e.target.value)}
        moduleOptions={al.moduleOptions}
        actionFilter={al.actionFilter}
        onAction={(e) => al.setActionFilter(e.target.value)}
        actionOptions={al.actionOptions}
        statusFilter={al.statusFilter}
        onStatus={(e) => al.setStatusFilter(e.target.value)}
        statusOptions={al.statusOptions}
        rangeFilter={al.rangeFilter}
        onRange={(e) => al.setRangeFilter(e.target.value)}
        rangeOptions={al.rangeOptions}
        onResetFilters={al.resetFilters}
      />

      <ActivityLogTable rows={al.filtered} noResults={al.noResults} darkMode={darkMode} onView={al.openDetail} />

      <ActivityLogDetailModal log={al.current} onClose={al.closeDetail} />
    </div>
  );
}
