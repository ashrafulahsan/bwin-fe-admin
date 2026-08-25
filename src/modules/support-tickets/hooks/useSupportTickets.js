"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  SUPPORT_TICKETS,
  TICKET_CATEGORIES,
  TICKET_STATUSES,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_TONES,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_TONES,
  TICKET_ASSIGNEES,
} from "../constants/supportTickets.mock";

const BODY_FONT = "var(--font-body)";
const MONO_FONT = "var(--font-mono)";

export function useSupportTickets() {
  const [tickets, setTickets] = useState(SUPPORT_TICKETS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [detailId, setDetailId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replyIsNote, setReplyIsNote] = useState(false);
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
    return tickets.filter(
      (t) =>
        (statusFilter === "all" || t.status === statusFilter) &&
        (priorityFilter === "all" || t.priority === priorityFilter) &&
        (categoryFilter === "all" || t.category === categoryFilter) &&
        (!q || `${t.ticket_no} ${t.subject} ${t.student_name} ${t.description}`.toLowerCase().includes(q))
    );
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
  };

  const count = (st) => tickets.filter((t) => t.status === st).length;
  const stats = [
    { key: "all", label: "All tickets", value: tickets.length },
    { key: "open", label: "Open", value: count("open") },
    { key: "in_progress", label: "In progress", value: count("in_progress") },
    { key: "resolved", label: "Resolved", value: count("resolved") },
    { key: "escalated", label: "Escalated", value: tickets.filter((t) => t.is_escalated).length },
  ].map((st) => ({
    ...st,
    active: st.key !== "escalated" && statusFilter === st.key,
    onClick: () => setStatusFilter(st.key === "escalated" ? "all" : st.key),
  }));

  const setStatus = (id, status) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status, updated_at: "just now" } : t)));
    setDraft((d) => (d && d.id === id ? { ...d, status } : d));
  };

  const setAssignee = (id, assigned_to) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, assigned_to: assigned_to || null, updated_at: "just now" } : t)));
    setDraft((d) => (d && d.id === id ? { ...d, assigned_to: assigned_to || null } : d));
  };

  const openDetail = (row) => {
    setDetailId(row.id);
    setDraft({ ...row });
    setReplyDraft("");
    setReplyIsNote(false);
  };
  const closeDetail = () => {
    setDetailId(null);
    setDraft(null);
  };

  const setDraftField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const sendReply = () => {
    const text = replyDraft.trim();
    if (!text || !draft) return;
    const msg = { author: "You", is_internal_note: replyIsNote, is_system_message: false, message: text, created_at: "just now" };
    setDraft((d) => ({
      ...d,
      messages: [...(d.messages || []), msg],
      total_replies: (d.total_replies || 0) + 1,
      last_reply_at: "just now",
    }));
    setReplyDraft("");
    setReplyIsNote(false);
    flash(replyIsNote ? "Internal note added." : "Reply added to conversation.");
  };

  const toggleEscalate = () => setDraft((d) => ({ ...d, is_escalated: !d.is_escalated }));

  const saveDetail = () => {
    if (!draft) return;
    setTickets((prev) => prev.map((t) => (t.id === draft.id ? { ...draft, updated_at: "just now" } : t)));
    flash(`Saved changes to ${draft.ticket_no}.`);
    closeDetail();
  };

  const exportCsv = () => {
    const cols = ["ticket_no", "subject", "student_name", "category", "priority", "status", "assigned_to", "created_at"];
    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = [cols.join(",")].concat(filtered.map((t) => cols.map((k) => esc(t[k])).join(","))).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "bwin-support-tickets.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    flash(`Exported ${filtered.length} tickets to CSV.`);
  };

  const statusOptions = [{ value: "all", label: "All statuses" }].concat(TICKET_STATUSES.map((v) => ({ value: v, label: TICKET_STATUS_LABELS[v] })));
  const priorityOptions = [{ value: "all", label: "All priorities" }].concat(Object.keys(TICKET_PRIORITY_LABELS).map((v) => ({ value: v, label: TICKET_PRIORITY_LABELS[v] })));
  const categoryOptions = [{ value: "all", label: "All categories" }].concat(TICKET_CATEGORIES.map((v) => ({ value: v, label: v })));
  const statusChangeOptions = TICKET_STATUSES.map((v) => ({ value: v, label: TICKET_STATUS_LABELS[v] }));
  const assigneeOptions = [{ value: "", label: "Unassigned" }].concat(TICKET_ASSIGNEES.map((v) => ({ value: v, label: v })));

  const rows = filtered.map((t) => ({
    ...t,
    priorityLabel: TICKET_PRIORITY_LABELS[t.priority] || t.priority,
    priorityTone: TICKET_PRIORITY_TONES[t.priority] || "neutral",
    assignedValue: t.assigned_to || "",
    lastReplyDisplay: t.last_reply_at || "—",
    onView: () => openDetail(t),
    onStatusChange: (e) => setStatus(t.id, e.target.value),
    onAssignChange: (e) => setAssignee(t.id, e.target.value),
  }));

  const detail = draft
    ? {
        ...draft,
        assignedValue: draft.assigned_to || "",
        priorityLabel: TICKET_PRIORITY_LABELS[draft.priority] || draft.priority,
        priorityTone: TICKET_PRIORITY_TONES[draft.priority] || "neutral",
        statusLabel: TICKET_STATUS_LABELS[draft.status] || draft.status,
        statusTone: TICKET_STATUS_TONES[draft.status] || "neutral",
        hasAttachments: (draft.attachments || []).length > 0,
        attachmentChips: draft.attachments || [],
        thread: (draft.messages || []).map((m) => ({
          ...m,
          isNote: m.is_internal_note,
          bg: m.is_internal_note ? "var(--orange-100)" : m.is_system_message ? "var(--surface-sunken)" : "var(--surface-page)",
          border: m.is_internal_note ? "var(--orange-500)" : "var(--border)",
        })),
      }
    : null;

  const detailFields = draft
    ? [
        { label: "Student", value: draft.student_name, font: BODY_FONT },
        { label: "Email", value: draft.student_email, font: BODY_FONT },
        { label: "Category", value: draft.category, font: BODY_FONT },
        { label: "Source", value: draft.source, font: BODY_FONT },
        { label: "First response", value: draft.first_response_at || "—", font: MONO_FONT },
        { label: "Satisfaction", value: draft.satisfaction_rating ? `${draft.satisfaction_rating} / 5` : "—", font: MONO_FONT },
      ]
    : [];

  return {
    rows,
    noResults: tickets.length > 0 && filtered.length === 0,
    resultCount: `${filtered.length} of ${tickets.length} tickets`,
    stats,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    statusOptions,
    priorityOptions,
    categoryOptions,
    statusChangeOptions,
    assigneeOptions,
    resetFilters,
    exportCsv,

    detailOpen: !!draft,
    detail,
    detailFields,
    closeDetail,
    onDetailStatus: (e) => setDraftField("status", e.target.value),
    onDetailAssignee: (e) => setDraftField("assigned_to", e.target.value || null),
    escalateLabel: draft && draft.is_escalated ? "Remove escalation" : "Escalate ticket",
    toggleEscalate,
    saveDetail,

    replyDraft,
    onReplyChange: (e) => setReplyDraft(e.target.value),
    replyIsNote,
    onReplyNoteToggle: (e) => setReplyIsNote(e.target.checked),
    sendReply,

    toast,
  };
}
