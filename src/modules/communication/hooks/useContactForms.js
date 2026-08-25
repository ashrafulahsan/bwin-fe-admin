"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CONTACT_SUBMISSIONS,
  CONTACT_INTERESTS,
  CONTACT_STATUSES,
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_TONES,
  CONTACT_ASSIGNEES,
} from "../constants/contactForms.mock";

const RANGE_DAYS = { today: 1, week: 7, month: 30 };

// "newest" is the latest submission in the set (not the real current time),
// same convention as modules/user-management's activity logs — keeps the
// fixed-timestamp mock data meaningfully filterable regardless of when this runs.
const newest = CONTACT_SUBMISSIONS.length ? new Date(CONTACT_SUBMISSIONS[0].created_at.replace(" ", "T")) : new Date();
const withinRange = (row, rangeFilter) => {
  if (rangeFilter === "all") return true;
  const days = RANGE_DAYS[rangeFilter] || 3650;
  return (newest - new Date(row.created_at.replace(" ", "T"))) / 86400000 < days;
};

export function useContactForms() {
  const [submissions, setSubmissions] = useState(CONTACT_SUBMISSIONS);
  const [search, setSearch] = useState("");
  const [interestFilter, setInterestFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("all");
  const [detailId, setDetailId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const flash = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter(
      (r) =>
        (interestFilter === "all" || r.interested_in === interestFilter) &&
        (statusFilter === "all" || r.status === statusFilter) &&
        withinRange(r, rangeFilter) &&
        (!q || `${r.full_name} ${r.email} ${r.phone} ${r.message} ${r.id} ${r.interested_in}`.toLowerCase().includes(q))
    );
  }, [submissions, search, interestFilter, statusFilter, rangeFilter]);

  const resetFilters = () => {
    setSearch("");
    setInterestFilter("all");
    setStatusFilter("all");
    setRangeFilter("all");
  };

  const count = (st) => submissions.filter((r) => r.status === st).length;
  const stats = [
    { key: "all", label: "All submissions", value: submissions.length },
    { key: "new", label: "New", value: count("new") },
    { key: "in_progress", label: "In progress", value: count("in_progress") },
    { key: "responded", label: "Responded", value: count("responded") },
  ];

  const setRowStatus = (id, status) => {
    setSubmissions((prev) => prev.map((r) => (r.id === id ? { ...r, status, updated_at: "just now" } : r)));
    setDraft((d) => (d && d.id === id ? { ...d, status } : d));
    flash(`Status updated to "${CONTACT_STATUS_LABELS[status] || status}".`);
  };

  const openDetail = (row) => {
    setDetailId(row.id);
    setDraft({ ...row });
  };
  const closeDetail = () => {
    setDetailId(null);
    setDraft(null);
  };

  const setDraftField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const saveDetail = () => {
    if (!draft) return;
    setSubmissions((prev) =>
      prev.map((r) => (r.id === draft.id ? { ...r, status: draft.status, assigned_to: draft.assigned_to || null, internal_note: draft.internal_note, updated_at: "just now" } : r))
    );
    flash(`Saved changes to ${draft.id}.`);
    closeDetail();
  };

  const replyByEmail = () => flash(`Opening reply to ${draft ? draft.email : ""}…`);

  const exportCsv = () => {
    const cols = ["id", "full_name", "email", "phone", "interested_in", "status", "created_at"];
    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = [cols.join(",")].concat(filtered.map((r) => cols.map((k) => esc(r[k])).join(","))).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "bwin-contact-submissions.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    flash(`Exported ${filtered.length} submissions to CSV.`);
  };

  const statusOptions = [{ value: "all", label: "All statuses" }].concat(CONTACT_STATUSES.map((v) => ({ value: v, label: CONTACT_STATUS_LABELS[v] || v })));
  const statusChangeOptions = CONTACT_STATUSES.map((v) => ({ value: v, label: CONTACT_STATUS_LABELS[v] || v }));
  const interestOptions = [{ value: "all", label: "All interests" }].concat(CONTACT_INTERESTS.map((v) => ({ value: v, label: v })));
  const assigneeOptions = [{ value: "", label: "Unassigned" }].concat(CONTACT_ASSIGNEES.map((v) => ({ value: v, label: v })));
  const rangeOptions = [
    { value: "all", label: "All time" },
    { value: "today", label: "Last 24 hours" },
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
  ];

  return {
    filtered,
    totalCount: submissions.length,
    noResults: submissions.length > 0 && filtered.length === 0,
    resultCount: `${filtered.length} of ${submissions.length} submissions`,
    stats,

    search,
    setSearch,
    interestFilter,
    setInterestFilter,
    statusFilter,
    setStatusFilter,
    rangeFilter,
    setRangeFilter,
    interestOptions,
    statusOptions,
    statusChangeOptions,
    assigneeOptions,
    rangeOptions,
    resetFilters,
    exportCsv,

    setRowStatus,
    openDetail,
    closeDetail,
    draft,
    setDraftField,
    saveDetail,
    replyByEmail,
    detailOpen: !!draft,

    statusLabels: CONTACT_STATUS_LABELS,
    statusTones: CONTACT_STATUS_TONES,

    toast,
  };
}
