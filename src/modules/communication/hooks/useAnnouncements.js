"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { plainText } from "@/utils/plainText";
import {
  ANNOUNCEMENTS,
  ANNOUNCEMENT_PLACEMENTS,
  ANNOUNCEMENT_CONTENT_TYPES,
  ANNOUNCEMENT_AUDIENCES,
  ANNOUNCEMENT_TONES,
} from "../constants/announcements.mock";

const BLANK = {
  id: null,
  title: "",
  placement: "header",
  content_type: "text",
  body: "",
  image_url: "",
  image_alt: "",
  tone: "navy",
  cta_label: "",
  cta_url: "",
  audience: "everyone",
  dismissible: true,
  is_active: false,
  starts_at: "",
  ends_at: "",
};

const lbl = (list, v) => {
  const f = list.find((o) => o.value === v);
  return f ? f.label : v;
};
const toneOf = (v) => ANNOUNCEMENT_TONES.find((t) => t.value === v) || { bg: "var(--navy-700)", fg: "#FFFFFF" };
const rate = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : "—");
const toDT = (v) => (v ? v.replace(" ", "T") : "");
const fromDT = (v) => (v ? v.replace("T", " ") : "");
const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function useAnnouncements() {
  const [items, setItems] = useState(ANNOUNCEMENTS);
  const [search, setSearch] = useState("");
  const [placementFilter, setPlacementFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [slot, setSlot] = useState("popup");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [formError, setFormError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState("");
  const seqRef = useRef(0);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const flash = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  };

  const liveIn = (p) => items.find((a) => a.is_active && a.placement === p) || null;

  const activate = (id) => {
    const item = items.find((a) => a.id === id);
    if (!item) return;
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: true } : a.placement === item.placement ? { ...a, is_active: false } : a)));
    const where = (ANNOUNCEMENT_PLACEMENTS.find((p) => p.value === item.placement) || {}).label || "";
    const where_lc = where.toLowerCase();
    flash(`Live in the ${where_lc} slot — "${item.title}" replaced any other ${where_lc} announcement.`);
  };

  const deactivate = (id) => {
    const item = items.find((a) => a.id === id);
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: false } : a)));
    flash(`${item ? item.title : id} turned off — that slot is empty now.`);
  };

  const openCreate = () => {
    setForm({ ...BLANK });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (a) => {
    setForm({
      id: a.id,
      title: a.title,
      placement: a.placement,
      content_type: a.content_type,
      body: a.body || "",
      image_url: a.image_url || "",
      image_alt: a.image_alt || "",
      tone: a.tone,
      cta_label: a.cta_label || "",
      cta_url: a.cta_url || "",
      audience: a.audience,
      dismissible: a.dismissible,
      is_active: a.is_active,
      starts_at: toDT(a.starts_at),
      ends_at: toDT(a.ends_at),
    });
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm({ ...BLANK });
    setFormError(null);
  };

  const setFormField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const duplicate = (a) => {
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    const copy = { ...a, id: `AN-${411 + seq}`, title: `${a.title} (copy)`, is_active: false, impressions: 0, clicks: 0, dismissals: 0, created_by: "You" };
    setItems((prev) => [copy, ...prev]);
    flash(`Duplicated as ${copy.id} — not live.`);
  };

  const save = () => {
    const f = form;
    if (!f.title.trim()) {
      setFormError("Give it an internal title so your team can find it.");
      return;
    }
    if (f.content_type === "text" && !plainText(f.body)) {
      setFormError("Write the message, or switch the content type to image.");
      return;
    }
    if (f.content_type === "image" && !f.image_url.trim()) {
      setFormError("Add an image URL, or switch the content type to text.");
      return;
    }
    if (f.starts_at && f.ends_at && f.ends_at < f.starts_at) {
      setFormError("The end date is before the start date.");
      return;
    }

    const patch = {
      title: f.title.trim(),
      placement: f.placement,
      content_type: f.content_type,
      body: f.content_type === "text" ? f.body : "",
      image_url: f.content_type === "image" ? f.image_url.trim() : "",
      image_alt: f.content_type === "image" ? f.image_alt.trim() : "",
      tone: f.tone,
      cta_label: f.cta_label.trim(),
      cta_url: f.cta_url.trim(),
      audience: f.audience,
      dismissible: f.dismissible,
      starts_at: fromDT(f.starts_at),
      ends_at: fromDT(f.ends_at),
      updated_at: nowStamp(),
    };

    if (f.id) {
      setItems((prev) =>
        prev.map((a) => (a.id === f.id ? { ...a, ...patch, is_active: f.is_active } : f.is_active && a.placement === f.placement ? { ...a, is_active: false } : a))
      );
      flash(f.is_active ? `${f.id} saved and set live.` : `Saved changes to ${f.id}.`);
      closeForm();
      return;
    }

    const seq = seqRef.current + 1;
    seqRef.current = seq;
    const item = { id: `AN-${411 + seq}`, ...patch, is_active: f.is_active, impressions: 0, clicks: 0, dismissals: 0, created_by: "You", created_at: nowStamp() };
    setItems((prev) => [item, ...(f.is_active ? prev.map((a) => (a.placement === f.placement ? { ...a, is_active: false } : a)) : prev)]);
    flash(f.is_active ? `${item.id} created and set live.` : `${item.id} saved — not live yet.`);
    closeForm();
  };

  const confirmDelete = () => {
    const id = deleteId;
    const item = items.find((a) => a.id === id);
    setItems((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
    flash(`Deleted ${item ? item.id : id}.`);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (a) =>
        (placementFilter === "all" || a.placement === placementFilter) &&
        (typeFilter === "all" || a.content_type === typeFilter) &&
        (stateFilter === "all" || (stateFilter === "active" ? a.is_active : !a.is_active)) &&
        (!q || `${a.title} ${plainText(a.body)} ${a.image_alt} ${a.id}`.toLowerCase().includes(q))
    );
  }, [items, search, placementFilter, typeFilter, stateFilter]);

  const live = liveIn(slot);
  const liveCount = ANNOUNCEMENT_PLACEMENTS.filter((p) => liveIn(p.value)).length;

  const slots = ANNOUNCEMENT_PLACEMENTS.map((p) => {
    const a = liveIn(p.value);
    const selected = slot === p.value;
    const tone = a ? toneOf(a.tone) : null;
    return {
      key: p.value,
      label: p.label,
      dot: a ? "var(--state-success)" : "var(--gray-300)",
      stateLabel: a ? "Live" : "Empty",
      stateColor: a ? "var(--state-success)" : "var(--text-muted)",
      border: selected ? "var(--orange-500)" : "var(--border)",
      bg: selected ? "var(--surface-sunken)" : "var(--surface-card)",
      bandBg: tone ? tone.bg : "var(--gray-200)",
      showHeaderBar: p.value === "header" && !!a,
      showFooterBar: p.value === "footer" && !!a,
      showPopup: p.value === "popup" && !!a,
      titleLine: a ? a.title : "Nothing scheduled here",
      titleColor: a ? "var(--text-primary)" : "var(--text-muted)",
      metaLine: a ? `${a.impressions.toLocaleString()} impressions · ${rate(a.clicks, a.impressions)} clicks` : `${items.filter((x) => x.placement === p.value).length} saved, none live`,
      onSelect: () => setSlot(p.value),
    };
  });

  const rows = filtered.map((a) => ({
    ...a,
    placementLabel: lbl(ANNOUNCEMENT_PLACEMENTS, a.placement),
    typeLabel: lbl(ANNOUNCEMENT_CONTENT_TYPES, a.content_type),
    audienceLabel: lbl(ANNOUNCEMENT_AUDIENCES, a.audience),
    preview: a.content_type === "image" ? a.image_alt || "Image announcement" : plainText(a.body).slice(0, 80) || "—",
    rowBg: a.is_active ? "var(--surface-sunken)" : "transparent",
    activeLabel: a.is_active ? "Live" : "Off",
    activeColor: a.is_active ? "var(--state-success)" : "var(--text-muted)",
    onToggle: () => (a.is_active ? deactivate(a.id) : activate(a.id)),
    onEdit: () => openEdit(a),
    onDelete: () => setDeleteId(a.id),
    onDuplicate: () => duplicate(a),
  }));

  const pending = items.find((a) => a.id === deleteId) || null;
  const clash = form.is_active ? liveIn(form.placement) : null;
  const replacing = clash && clash.id !== form.id;

  return {
    resultCount: `${filtered.length} of ${items.length} announcements`,
    rows,
    noResults: items.length > 0 && filtered.length === 0,

    slots,
    slot,
    hasLive: !!live,
    noLive: !live,
    liveDot: liveCount ? "var(--green-500)" : "var(--gray-300)",
    liveHeading: "Showing on the site now",
    liveSubtitle: `One pop up, one header, and one footer can run together — ${liveCount} of 3 slots filled.`,
    emptySlotMessage: `The ${lbl(ANNOUNCEMENT_PLACEMENTS, slot).toLowerCase()} slot is empty — activate one from the list below, or create a new announcement.`,
    live: live
      ? {
          ...live,
          placementLabel: lbl(ANNOUNCEMENT_PLACEMENTS, live.placement),
          typeLabel: lbl(ANNOUNCEMENT_CONTENT_TYPES, live.content_type),
          bg: toneOf(live.tone).bg,
          fg: toneOf(live.tone).fg,
          bodyHtml: live.content_type === "text" ? live.body : `<p>${live.image_alt || "Image announcement"}</p>`,
          imageLabel: live.image_url || live.image_alt || "Image announcement",
          isPopup: live.placement === "popup",
          isHeader: live.placement === "header",
          isFooter: live.placement === "footer",
          isImage: live.content_type === "image",
          isText: live.content_type === "text",
          hasCta: !!live.cta_label,
          window: `${live.starts_at || "—"} → ${live.ends_at || "no end date"}`,
        }
      : null,
    liveMetrics: live
      ? [
          { label: "Impressions", value: live.impressions.toLocaleString(), sub: lbl(ANNOUNCEMENT_AUDIENCES, live.audience) },
          { label: "Clicks", value: live.clicks.toLocaleString(), sub: `${rate(live.clicks, live.impressions)} click rate` },
          { label: "Dismissals", value: live.dismissals.toLocaleString(), sub: `${rate(live.dismissals, live.impressions)} dismissed` },
          { label: "Placement", value: lbl(ANNOUNCEMENT_PLACEMENTS, live.placement), sub: live.dismissible ? "Dismissible" : "Not dismissible" },
        ]
      : [],
    deactivateLive: () => live && deactivate(live.id),

    search,
    setSearch,
    placementFilter,
    setPlacementFilter,
    typeFilter,
    setTypeFilter,
    stateFilter,
    setStateFilter,
    placementFilterOptions: [{ value: "all", label: "All placements" }].concat(ANNOUNCEMENT_PLACEMENTS.map((p) => ({ value: p.value, label: p.label }))),
    typeFilterOptions: [{ value: "all", label: "Text and image" }].concat(ANNOUNCEMENT_CONTENT_TYPES),
    stateOptions: [
      { value: "all", label: "All" },
      { value: "active", label: "Live only" },
      { value: "inactive", label: "Off only" },
    ],
    resetFilters: () => {
      setSearch("");
      setPlacementFilter("all");
      setTypeFilter("all");
      setStateFilter("all");
    },

    formOpen,
    formTitle: form.id ? `Edit ${form.id}` : "New announcement",
    formSubtitle: form.id ? "Changes apply the moment you save" : "Pick where it shows, then write the content",
    openCreate,
    closeForm,
    form,
    formError,
    formIsText: form.content_type === "text",
    formIsImage: form.content_type === "image",
    formHasImage: form.content_type === "image" && !!form.image_url.trim(),
    formNoImage: form.content_type === "image" && !form.image_url.trim(),
    setFormField,
    placementChoices: ANNOUNCEMENT_PLACEMENTS.map((p) => ({
      label: p.label,
      hint: p.hint,
      border: form.placement === p.value ? "var(--orange-500)" : "var(--border)",
      bg: form.placement === p.value ? "var(--surface-sunken)" : "var(--surface-card)",
      onClick: () => setFormField("placement", p.value),
    })),
    typeOptions: ANNOUNCEMENT_CONTENT_TYPES,
    toneOptions: ANNOUNCEMENT_TONES.map((t) => ({ value: t.value, label: t.label })),
    audienceOptions: ANNOUNCEMENT_AUDIENCES,
    replaceWarning: replacing ? `Saving this will turn off "${clash.title}" — only one ${lbl(ANNOUNCEMENT_PLACEMENTS, form.placement).toLowerCase()} announcement can run at a time.` : "",
    submitLabel: form.id ? "Save announcement" : "Create announcement",
    submitForm: save,

    deleteOpen: !!pending,
    deleteMessage: pending
      ? pending.is_active
        ? `"${pending.title}" is live right now. Deleting it removes it from the site immediately.`
        : `"${pending.title}" will be removed along with its impression and click history.`
      : "",
    cancelDelete: () => setDeleteId(null),
    confirmDelete,

    toast,
  };
}
