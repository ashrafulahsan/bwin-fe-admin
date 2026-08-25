"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  NOTIFICATIONS,
  NOTIFICATION_ORIGIN_LABELS,
  NOTIFICATION_AUDIENCES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_STATUSES,
  NOTIFICATION_STATUS_LABELS,
  NOTIFICATION_STATUS_TONES,
  NOTIFICATION_CATEGORIES,
} from "../constants/notifications.mock";
import { plainText } from "@/utils/plainText";

const BLANK_FORM = {
  title: "",
  body: "",
  audience: "all",
  category: "Announcement",
  channel: "in_app",
  priority: "normal",
  action_label: "",
  action_url: "",
  scheduled_at: "",
};

const REACH_BY_AUDIENCE = { all: 3140, students: 1284, instructors: 31, clients: 218, staff: 24, custom: 12 };

const capitalize = (v) => String(v).charAt(0).toUpperCase() + String(v).slice(1);
const optionLabel = (list, value) => {
  const found = list.find((o) => o.value === value);
  return found ? found.label : value;
};

export function useNotifications() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [originTab, setOriginTab] = useState("all"); // "all" | "admin" | "system"
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [viewId, setViewId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [formError, setFormError] = useState(null);
  const [toast, setToast] = useState("");
  const [seq, setSeq] = useState(0);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const flash = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (n) =>
        (originTab === "all" || n.origin === originTab) &&
        (categoryFilter === "all" || n.category === categoryFilter) &&
        (audienceFilter === "all" || n.audience === audienceFilter) &&
        (statusFilter === "all" || n.status === statusFilter) &&
        (!q || `${n.title} ${n.preview} ${n.id} ${n.category} ${n.created_by}`.toLowerCase().includes(q))
    );
  }, [items, search, originTab, categoryFilter, audienceFilter, statusFilter]);

  const countBy = (fn) => items.filter(fn).length;

  const stats = [
    { key: "all", label: "Total notifications", value: items.length, active: originTab === "all", onClick: () => setOriginTab("all") },
    { key: "admin", label: "Admin created", value: countBy((n) => n.origin === "admin"), active: originTab === "admin", onClick: () => setOriginTab("admin") },
    { key: "system", label: "System generated", value: countBy((n) => n.origin === "system"), active: originTab === "system", onClick: () => setOriginTab("system") },
    {
      key: "sched",
      label: "Scheduled",
      value: countBy((n) => n.status === "scheduled"),
      active: statusFilter === "scheduled",
      onClick: () => setStatusFilter((s) => (s === "scheduled" ? "all" : "scheduled")),
    },
  ];

  const tabs = [
    { key: "all", label: `All (${items.length})` },
    { key: "admin", label: `Admin created (${countBy((n) => n.origin === "admin")})` },
    { key: "system", label: `System generated (${countBy((n) => n.origin === "system")})` },
  ].map((t) => ({ ...t, active: originTab === t.key, onClick: () => setOriginTab(t.key) }));

  const dotColor = (priority) => (priority === "urgent" ? "var(--red-500)" : priority === "high" ? "var(--amber-500)" : "var(--gray-300)");

  const rows = filtered.map((n) => ({
    ...n,
    originLabel: NOTIFICATION_ORIGIN_LABELS[n.origin] || n.origin,
    audienceLabel: optionLabel(NOTIFICATION_AUDIENCES, n.audience),
    channelLabel: optionLabel(NOTIFICATION_CHANNELS, n.channel),
    statusLabel: NOTIFICATION_STATUS_LABELS[n.status] || n.status,
    statusTone: NOTIFICATION_STATUS_TONES[n.status] || "neutral",
    priorityDot: dotColor(n.priority),
    whenValue: n.sent_at || n.scheduled_at || "—",
    reachLabel:
      n.status === "sent"
        ? `${n.read_count.toLocaleString()} of ${n.recipient_count.toLocaleString()} read`
        : n.status === "scheduled"
        ? `${n.recipient_count.toLocaleString()} recipients queued`
        : n.status === "failed"
        ? "Delivery failed"
        : "Not sent yet",
    canView: n.origin === "admin",
  }));

  const current = items.find((n) => n.id === viewId) || null;

  const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}% of recipients` : "—");

  const detail = current
    ? {
        ...current,
        originLabel: NOTIFICATION_ORIGIN_LABELS[current.origin] || current.origin,
        statusLabel: NOTIFICATION_STATUS_LABELS[current.status] || current.status,
        statusTone: NOTIFICATION_STATUS_TONES[current.status] || "neutral",
        hasAction: !!current.action_label,
      }
    : null;

  const detailMetrics = current
    ? [
        { label: "Recipients", value: current.recipient_count.toLocaleString(), sub: optionLabel(NOTIFICATION_AUDIENCES, current.audience) },
        { label: "Delivered", value: current.delivered_count.toLocaleString(), sub: pct(current.delivered_count, current.recipient_count) },
        { label: "Read", value: current.read_count.toLocaleString(), sub: pct(current.read_count, current.recipient_count) },
        { label: "Clicked", value: current.click_count.toLocaleString(), sub: pct(current.click_count, current.recipient_count) },
      ]
    : [];

  const detailFields = current
    ? [
        { label: "Type", value: NOTIFICATION_ORIGIN_LABELS[current.origin] || current.origin, font: "var(--font-body)" },
        { label: "Category", value: current.category, font: "var(--font-body)" },
        { label: "Audience", value: optionLabel(NOTIFICATION_AUDIENCES, current.audience), font: "var(--font-body)" },
        { label: "Channel", value: optionLabel(NOTIFICATION_CHANNELS, current.channel), font: "var(--font-body)" },
        { label: "Priority", value: capitalize(current.priority), font: "var(--font-body)" },
        { label: "Created by", value: current.created_by, font: "var(--font-body)" },
        { label: "Created at", value: current.created_at, font: "var(--font-mono)" },
        { label: "Scheduled at", value: current.scheduled_at || "—", font: "var(--font-mono)" },
        { label: "Sent at", value: current.sent_at || "—", font: "var(--font-mono)" },
      ]
    : [];

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setAudienceFilter("all");
    setStatusFilter("all");
    setOriginTab("all");
  };

  const setFormField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFormError(null);
  };

  const openCreate = () => {
    setCreateOpen(true);
    setForm(BLANK_FORM);
    setFormError(null);
  };
  const closeCreate = () => {
    setCreateOpen(false);
    setForm(BLANK_FORM);
    setFormError(null);
  };

  const create = (mode) => {
    if (!form.title.trim()) {
      setFormError("Give the notification a title before saving.");
      return;
    }
    if (mode !== "draft" && !plainText(form.body)) {
      setFormError("Add a message — recipients need to know what changed.");
      return;
    }
    const nextSeq = seq + 1;
    const now = new Date();
    const stamp = (d) => d.toISOString().slice(0, 16).replace("T", " ");
    const scheduled = form.scheduled_at ? form.scheduled_at.replace("T", " ") : null;
    const finalStatus = mode === "draft" ? "draft" : scheduled ? "scheduled" : "sent";
    const reach = REACH_BY_AUDIENCE[form.audience] || 0;

    const item = {
      id: `NT-${2092 + nextSeq}`,
      origin: "admin",
      title: form.title.trim(),
      body: form.body,
      preview: plainText(form.body).slice(0, 90) || "—",
      category: form.category,
      audience: form.audience,
      channel: form.channel,
      priority: form.priority,
      status: finalStatus,
      created_by: "You",
      recipient_count: finalStatus === "draft" ? 0 : reach,
      delivered_count: finalStatus === "sent" ? reach : 0,
      read_count: 0,
      click_count: 0,
      action_label: form.action_label.trim() || null,
      action_url: form.action_url.trim() || null,
      scheduled_at: scheduled,
      sent_at: finalStatus === "sent" ? stamp(now) : null,
      created_at: stamp(now),
    };

    setItems((prev) => [item, ...prev]);
    setSeq(nextSeq);
    setCreateOpen(false);
    setForm(BLANK_FORM);
    setFormError(null);
    flash(
      finalStatus === "draft"
        ? `Draft saved — ${item.id}.`
        : finalStatus === "scheduled"
        ? `${item.id} scheduled for ${scheduled}.`
        : `${item.id} sent to ${reach.toLocaleString()} recipients.`
    );
  };

  const statusOptions = [{ value: "all", label: "All statuses" }].concat(NOTIFICATION_STATUSES.map((v) => ({ value: v, label: NOTIFICATION_STATUS_LABELS[v] || v })));
  const categoryOptions = [{ value: "all", label: "All categories" }].concat(NOTIFICATION_CATEGORIES.map((c) => ({ value: c, label: c })));
  // NOTIFICATION_AUDIENCES already has its own value:"all" entry ("Everyone",
  // a real broadcast audience) — drop it here so it doesn't collide with the
  // "no filter" sentinel of the same value (the design source has this same
  // clash; keeping the "Everyone" audience unfilterable via this dropdown is
  // an acceptable trade-off since the two were indistinguishable in the UI anyway).
  const audienceFilterOptions = [{ value: "all", label: "All audiences" }].concat(NOTIFICATION_AUDIENCES.filter((a) => a.value !== "all"));
  const formCategoryOptions = NOTIFICATION_CATEGORIES.map((c) => ({ value: c, label: c }));
  const priorityOptions = NOTIFICATION_PRIORITIES.map((p) => ({ value: p, label: capitalize(p) }));

  return {
    listVisible: !current,
    detailVisible: !!current,
    rows,
    stats,
    tabs,
    noResults: items.length > 0 && filtered.length === 0,
    resultCount: `${filtered.length} of ${items.length} notifications`,

    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    audienceFilter,
    setAudienceFilter,
    statusFilter,
    setStatusFilter,
    categoryOptions,
    audienceFilterOptions,
    statusOptions,
    resetFilters,

    viewNotification: (id) => setViewId(id),
    closeDetail: () => setViewId(null),
    detail,
    detailMetrics,
    detailFields,

    createOpen,
    openCreate,
    closeCreate,
    form,
    setFormField,
    formError,
    audienceOptions: NOTIFICATION_AUDIENCES,
    channelOptions: NOTIFICATION_CHANNELS,
    formCategoryOptions,
    priorityOptions,
    submitLabel: form.scheduled_at ? "Schedule notification" : "Send notification",
    submitCreate: () => create("send"),
    saveDraft: () => create("draft"),

    toast,
  };
}
