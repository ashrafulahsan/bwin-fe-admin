"use client";

import { useMemo, useState } from "react";
import { AUTOMATIONS, AUTOMATION_CATEGORIES, AUTOMATION_STATUSES, nameById } from "../constants/automations.mock";
import { EMPTY_AUTOMATION_FORM } from "../constants/automationFormFields";
import { validateAutomationForm } from "../validation/validateAutomationForm";

const capitalize = (v) => String(v || "").charAt(0).toUpperCase() + String(v || "").slice(1);
const nowStamp = () => new Date().toISOString().slice(0, 19).replace("T", " ") + "+06";

function toForm(a) {
  return {
    ...EMPTY_AUTOMATION_FORM,
    title: a.title || "",
    slug: a.slug || "",
    description: a.description || "",
    lists: a.lists && a.lists.length ? a.lists.slice() : [""],
    category_id: a.category_id || "",
    image_url: a.image_url || "",
    video_url: a.video_url || "",
    status: a.status || "draft",
    meta_title: a.meta_title || "",
    meta_description: a.meta_description || "",
    meta_keywords: a.meta_keywords || "",
    canonical_url: a.canonical_url || "",
    og_title: a.og_title || "",
    og_description: a.og_description || "",
    og_image_url: a.og_image_url || "",
    meta_robots: a.meta_robots || "index, follow",
  };
}

function fromForm(f) {
  return {
    title: f.title.trim(),
    slug: f.slug.trim(),
    description: f.description || null,
    lists: f.lists.map((x) => x.trim()).filter(Boolean),
    category_id: f.category_id || null,
    image_url: f.image_url.trim() || null,
    video_url: f.video_url.trim() || null,
    status: f.status,
    meta_title: f.meta_title.trim() || null,
    meta_description: f.meta_description.trim() || null,
    meta_keywords: f.meta_keywords.trim() || null,
    canonical_url: f.canonical_url.trim() || null,
    og_title: f.og_title.trim() || null,
    og_description: f.og_description.trim() || null,
    og_image_url: f.og_image_url.trim() || null,
    meta_robots: f.meta_robots,
    updated_at: nowStamp(),
    // No auth session wired up yet — attributed to the seed super-admin, same
    // stand-in the design source used.
    updated_by: "Amara Okafor",
  };
}

export function useAutomations() {
  const [automations, setAutomations] = useState(AUTOMATIONS);
  const [view, setView] = useState("list"); // "list" | "form"
  const [editId, setEditId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [notice, setNotice] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [showDeleted, setShowDeleted] = useState(false);

  const [form, setForm] = useState(EMPTY_AUTOMATION_FORM);
  const [formError, setFormError] = useState(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const patch = (id, changes, noticeText) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, ...changes } : a)));
    setNotice(noticeText || null);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return automations
      .filter((a) => {
        if (showDeleted ? !a.deleted_at : !!a.deleted_at) return false;
        if (category !== "all" && a.category_id !== category) return false;
        if (status !== "all" && a.status !== status) return false;
        if (q) {
          const hay = `${a.title} ${a.slug}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
  }, [automations, search, category, status, showDeleted]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  };

  const live = useMemo(() => automations.filter((a) => !a.deleted_at), [automations]);
  const stats = [
    { label: "Total automations", value: String(live.length) },
    { label: "Published", value: String(live.filter((a) => a.status === "published").length) },
    { label: "Draft / review", value: String(live.filter((a) => a.status === "draft" || a.status === "review").length) },
    { label: "Runs, last 30 days", value: live.reduce((n, a) => n + (a.runs_30d || 0), 0).toLocaleString("en-US") },
  ];

  const filterSelects = [
    {
      key: "category",
      label: "Category",
      value: category,
      onChange: (e) => setCategory(e.target.value),
      options: [{ value: "all", label: "All categories" }].concat(AUTOMATION_CATEGORIES.map((x) => ({ value: x.id, label: x.name }))),
    },
    {
      key: "status",
      label: "Status",
      value: status,
      onChange: (e) => setStatus(e.target.value),
      options: [{ value: "all", label: "All statuses" }].concat(AUTOMATION_STATUSES.map((v) => ({ value: v, label: capitalize(v) }))),
    },
  ];

  const openNew = () => {
    setView("form");
    setEditId(null);
    setForm(EMPTY_AUTOMATION_FORM);
    setFormError(null);
    setAdvancedOpen(false);
    setNotice(null);
  };
  const openEdit = (a) => {
    setView("form");
    setEditId(a.id);
    setForm(toForm(a));
    setFormError(null);
    setDetailId(null);
    setAdvancedOpen(false);
  };
  const cancelForm = () => {
    setView("list");
    setEditId(null);
    setForm(EMPTY_AUTOMATION_FORM);
    setFormError(null);
    setAdvancedOpen(false);
  };

  const setFormField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFormError(null);
  };

  const submit = (publish) => {
    const err = validateAutomationForm(form, automations, editId);
    if (err) {
      setFormError(err);
      return;
    }
    const now = nowStamp();
    const base = fromForm(form);
    const nextStatus = publish ? "published" : base.status === "published" ? "draft" : base.status;
    const rec = { ...base, status: nextStatus, published_at: publish ? now : null };

    if (editId) {
      patch(editId, rec, `${rec.title} saved${publish ? " and published" : ""}.`);
      setView("list");
      setEditId(null);
      setFormError(null);
      setForm(EMPTY_AUTOMATION_FORM);
      setAdvancedOpen(false);
      return;
    }

    const id = `new-${automations.length + 1}`;
    setAutomations((prev) => prev.concat({ ...rec, id, created_at: now, created_by: "Amara Okafor", deleted_at: null, runs_30d: 0 }));
    setView("list");
    setFormError(null);
    setForm(EMPTY_AUTOMATION_FORM);
    setAdvancedOpen(false);
    setNotice(`${rec.title} created as ${nextStatus}.`);
  };

  const duplicate = (a) => {
    const now = nowStamp();
    const n = automations.filter((x) => String(x.id).startsWith("new-")).length + 1;
    const id = `new-${automations.length + 1}`;
    setAutomations((prev) =>
      prev.concat({
        ...a,
        id,
        title: `${a.title} (copy)`,
        slug: `${a.slug}-copy-${n}`,
        status: "draft",
        published_at: null,
        runs_30d: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      })
    );
    setNotice(`${a.title} duplicated as a draft.`);
  };

  const togglePublish = (a) => {
    const published = a.status === "published";
    patch(
      a.id,
      published ? { status: "draft" } : { status: "published", published_at: nowStamp() },
      `${a.title} ${published ? "moved back to draft" : "published"}.`
    );
  };

  const toggleDelete = (a) =>
    patch(a.id, { deleted_at: a.deleted_at ? null : nowStamp() }, `${a.title} ${a.deleted_at ? "restored" : "deleted — recoverable from “Showing deleted”"}.`);

  const exportCsv = () => {
    const cols = ["title", "slug", "status", "published_at", "runs_30d", "updated_at", "updated_by"];
    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = [cols.join(",")].concat(filtered.map((r) => cols.map((k) => esc(r[k])).join(","))).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const el = document.createElement("a");
    el.href = url;
    el.download = "bwin-automations.csv";
    el.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setNotice(`Exported ${filtered.length} automations to bwin-automations.csv.`);
  };

  const editing = editId ? automations.find((a) => a.id === editId) : null;
  const current = detailId ? automations.find((a) => a.id === detailId) : null;

  return {
    filtered,
    totalCount: automations.length,
    noResults: filtered.length === 0,
    stats,
    resultCount: `${filtered.length} of ${automations.length} automations`,
    notice,
    dismissNotice: () => setNotice(null),
    exportCsv,

    search,
    setSearch,
    filterSelects,
    resetFilters,
    showDeleted,
    toggleShowDeleted: () => setShowDeleted((v) => !v),

    onView: setDetailId,
    onEdit: openEdit,
    onDuplicate: duplicate,
    onPublish: togglePublish,
    onDelete: toggleDelete,

    current,
    closeDetail: () => setDetailId(null),
    editFromDetail: () => {
      if (current) openEdit(current);
    },

    view,
    editing,
    openNew,
    cancelForm,
    form,
    setFormField,
    formError,
    advancedOpen,
    toggleAdvanced: () => setAdvancedOpen((o) => !o),
    saveDraft: () => submit(false),
    savePublish: () => submit(true),

    nameById,
  };
}
