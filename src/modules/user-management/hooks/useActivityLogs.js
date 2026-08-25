"use client";

import { useMemo, useState } from "react";
import { ACTIVITY_LOGS, LOG_ACTIONS, LOG_MODULES, LOG_STATUSES } from "../constants/activityLogs.mock";

const capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);

const RANGE_DAYS = { today: 1, week: 7, month: 30 };

// Mirrors the design source's date-range filter: "newest" is the latest row
// in the set (not the real current time), so the mock dataset's fixed
// timestamps stay meaningfully filterable regardless of when this runs.
const newest = ACTIVITY_LOGS.length ? new Date(ACTIVITY_LOGS[0].created_at.replace(" ", "T")) : new Date();
const withinRange = (row, rangeFilter) => {
  if (rangeFilter === "all") return true;
  const days = RANGE_DAYS[rangeFilter] || 3650;
  const d = new Date(row.created_at.replace(" ", "T"));
  return (newest - d) / 86400000 < days;
};

export function useActivityLogs() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("all");
  const [detailId, setDetailId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ACTIVITY_LOGS.filter(
      (r) =>
        (moduleFilter === "all" || r.module === moduleFilter) &&
        (actionFilter === "all" || r.action === actionFilter) &&
        (statusFilter === "all" || r.status === statusFilter) &&
        withinRange(r, rangeFilter) &&
        (!q || `${r.user_name} ${r.role_name} ${r.description} ${r.entity_type} ${r.entity_id} ${r.ip_address}`.toLowerCase().includes(q))
    );
  }, [search, moduleFilter, actionFilter, statusFilter, rangeFilter]);

  const resetFilters = () => {
    setSearch("");
    setModuleFilter("all");
    setActionFilter("all");
    setStatusFilter("all");
    setRangeFilter("all");
  };

  const opts = (values, allLabel) => [{ value: "all", label: allLabel }].concat(values.map((v) => ({ value: v, label: capitalize(v) })));

  const current = ACTIVITY_LOGS.find((r) => r.id === detailId) || null;

  return {
    logs: ACTIVITY_LOGS,
    filtered,
    noResults: ACTIVITY_LOGS.length > 0 && filtered.length === 0,

    search,
    setSearch,
    moduleFilter,
    setModuleFilter,
    actionFilter,
    setActionFilter,
    statusFilter,
    setStatusFilter,
    rangeFilter,
    setRangeFilter,
    resetFilters,

    moduleOptions: opts(LOG_MODULES, "All modules"),
    actionOptions: opts(LOG_ACTIONS, "All actions"),
    statusOptions: opts(LOG_STATUSES, "All statuses"),
    rangeOptions: [
      { value: "all", label: "All time" },
      { value: "today", label: "Last 24 hours" },
      { value: "week", label: "Last 7 days" },
      { value: "month", label: "Last 30 days" },
    ],

    current,
    openDetail: setDetailId,
    closeDetail: () => setDetailId(null),
  };
}
