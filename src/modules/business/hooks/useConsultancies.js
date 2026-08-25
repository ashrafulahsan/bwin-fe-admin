"use client";

import { useMemo, useState } from "react";
import { CONSULTANCIES, CONSULTANCY_CATEGORIES, CONSULTANCY_TYPES, CONSULTANCY_STATUSES, nameById } from "../constants/consultancies.mock";
import { EMPTY_CONSULTANCY_FORM } from "../constants/consultancyFormFields";
import { validateConsultancyForm } from "../validation/validateConsultancyForm";

const capitalize = (v) => String(v || "").charAt(0).toUpperCase() + String(v || "").slice(1);
const nowStamp = () => new Date().toISOString().slice(0, 19).replace("T", " ") + "+06";

function toForm(c) {
  return {
    ...EMPTY_CONSULTANCY_FORM,
    consultancy_code: c.consultancy_code || "",
    title: c.title || "",
    slug: c.slug || "",
    description: c.description || "",
    consultancy_type: c.consultancy_type || "general",
    category_id: c.category_id || "",
    status: c.status || "draft",
    sort_order: String(c.sort_order ?? 0),
    thumbnail: c.thumbnail || "",
    promo_video_url: c.promo_video_url || "",
    meta_title: c.meta_title || "",
    meta_description: c.meta_description || "",
    meta_keywords: c.meta_keywords || "",
    canonical_url: c.canonical_url || "",
    og_title: c.og_title || "",
    og_description: c.og_description || "",
    og_image_url: c.og_image_url || "",
    meta_robots: c.meta_robots || "index, follow",
  };
}

function fromForm(f) {
  return {
    consultancy_code: f.consultancy_code.trim(),
    title: f.title.trim(),
    slug: f.slug.trim(),
    description: f.description,
    consultancy_type: f.consultancy_type,
    category_id: f.category_id || null,
    status: f.status,
    sort_order: parseInt(f.sort_order, 10) || 0,
    thumbnail: f.thumbnail.trim() || null,
    promo_video_url: f.promo_video_url.trim() || null,
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

export function useConsultancies() {
  const [consultancies, setConsultancies] = useState(CONSULTANCIES);
  const [view, setView] = useState("list"); // "list" | "form"
  const [editId, setEditId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [notice, setNotice] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [showDeleted, setShowDeleted] = useState(false);

  const [form, setForm] = useState(EMPTY_CONSULTANCY_FORM);
  const [formError, setFormError] = useState(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const patch = (id, changes, noticeText) => {
    setConsultancies((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));
    setNotice(noticeText || null);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return consultancies
      .filter((c) => {
        if (showDeleted ? !c.deleted_at : !!c.deleted_at) return false;
        if (category !== "all" && c.category_id !== category) return false;
        if (type !== "all" && c.consultancy_type !== type) return false;
        if (status !== "all" && c.status !== status) return false;
        if (q) {
          const hay = `${c.title} ${c.consultancy_code} ${c.slug}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [consultancies, search, category, type, status, showDeleted]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setType("all");
    setStatus("all");
  };

  const live = useMemo(() => consultancies.filter((c) => !c.deleted_at), [consultancies]);
  const stats = [
    { label: "Total services", value: String(live.length) },
    { label: "Active", value: String(live.filter((c) => c.status === "active").length) },
    { label: "Draft", value: String(live.filter((c) => c.status === "draft").length) },
    { label: "Engagements", value: live.reduce((n, c) => n + (c.engagements || 0), 0).toLocaleString("en-US") },
  ];

  const filterSelects = [
    {
      key: "category",
      label: "Category",
      value: category,
      onChange: (e) => setCategory(e.target.value),
      options: [{ value: "all", label: "All categories" }].concat(CONSULTANCY_CATEGORIES.map((x) => ({ value: x.id, label: x.name }))),
    },
    {
      key: "type",
      label: "Type",
      value: type,
      onChange: (e) => setType(e.target.value),
      options: [{ value: "all", label: "All types" }].concat(CONSULTANCY_TYPES.map((v) => ({ value: v, label: capitalize(v) }))),
    },
    {
      key: "status",
      label: "Status",
      value: status,
      onChange: (e) => setStatus(e.target.value),
      options: [{ value: "all", label: "All statuses" }].concat(CONSULTANCY_STATUSES.map((v) => ({ value: v, label: capitalize(v) }))),
    },
  ];

  const openNew = () => {
    setView("form");
    setEditId(null);
    setForm(EMPTY_CONSULTANCY_FORM);
    setFormError(null);
    setAdvancedOpen(false);
    setNotice(null);
  };
  const openEdit = (c) => {
    setView("form");
    setEditId(c.id);
    setForm(toForm(c));
    setFormError(null);
    setDetailId(null);
    setAdvancedOpen(false);
  };
  const cancelForm = () => {
    setView("list");
    setEditId(null);
    setForm(EMPTY_CONSULTANCY_FORM);
    setFormError(null);
    setAdvancedOpen(false);
  };

  const setFormField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFormError(null);
  };

  const submit = (activate) => {
    const err = validateConsultancyForm(form, consultancies, editId);
    if (err) {
      setFormError(err);
      return;
    }
    const base = fromForm(form);
    const nextStatus = activate ? "active" : base.status === "active" ? "draft" : base.status;
    const rec = { ...base, status: nextStatus };

    if (editId) {
      patch(editId, rec, `${rec.title} saved${activate ? " and set active" : ""}.`);
      setView("list");
      setEditId(null);
      setFormError(null);
      setForm(EMPTY_CONSULTANCY_FORM);
      setAdvancedOpen(false);
      return;
    }

    const now = nowStamp();
    const id = `new-${consultancies.length + 1}`;
    setConsultancies((prev) => prev.concat({ ...rec, id, created_at: now, created_by: "Amara Okafor", deleted_at: null, engagements: 0 }));
    setView("list");
    setFormError(null);
    setForm(EMPTY_CONSULTANCY_FORM);
    setAdvancedOpen(false);
    setNotice(`${rec.title} created as ${nextStatus}.`);
  };

  const duplicate = (c) => {
    const now = nowStamp();
    const n = consultancies.filter((x) => String(x.id).startsWith("new-")).length + 1;
    const id = `new-${consultancies.length + 1}`;
    setConsultancies((prev) =>
      prev.concat({
        ...c,
        id,
        title: `${c.title} (copy)`,
        consultancy_code: `${c.consultancy_code}-C${n}`,
        slug: `${c.slug}-copy-${n}`,
        status: "draft",
        engagements: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      })
    );
    setNotice(`${c.title} duplicated as a draft.`);
  };

  const toggleStatus = (c) => {
    const isActive = c.status === "active";
    patch(c.id, { status: isActive ? "inactive" : "active" }, `${c.title} set ${isActive ? "inactive" : "active"}.`);
  };

  const toggleDelete = (c) =>
    patch(c.id, { deleted_at: c.deleted_at ? null : nowStamp() }, `${c.title} ${c.deleted_at ? "restored" : "deleted — recoverable from “Showing deleted”"}.`);

  const exportCsv = () => {
    const cols = ["consultancy_code", "title", "slug", "consultancy_type", "status", "sort_order", "engagements", "updated_at"];
    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = [cols.join(",")].concat(filtered.map((r) => cols.map((k) => esc(r[k])).join(","))).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "bwin-consultancies.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setNotice(`Exported ${filtered.length} services to bwin-consultancies.csv.`);
  };

  const editing = editId ? consultancies.find((c) => c.id === editId) : null;
  const current = detailId ? consultancies.find((c) => c.id === detailId) : null;

  return {
    filtered,
    totalCount: consultancies.length,
    noResults: filtered.length === 0,
    stats,
    resultCount: `${filtered.length} of ${consultancies.length} services`,
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
    onToggleStatus: toggleStatus,
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
    saveActive: () => submit(true),

    nameById,
  };
}
