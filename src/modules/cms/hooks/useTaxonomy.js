"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "@/utils/slugify";
import { CATEGORY_TYPES, CATEGORIES, CATEGORY_USAGE } from "../constants/taxonomy.mock";

const TBLANK = { id: null, name: "", slug: "", description: "", status: "active" };
const CBLANK = { id: null, name: "", slug: "", description: "", category_type_id: "", parent_category_id: "", status: "active" };
const TONE = { active: "success", draft: "warning", inactive: "neutral" };

const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function useTaxonomy() {
  const [types, setTypes] = useState(CATEGORY_TYPES);
  const [cats, setCats] = useState(CATEGORIES);
  const [typeId, setTypeId] = useState(CATEGORY_TYPES[0].id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [collapsed, setCollapsed] = useState({});
  const [typeFormOpen, setTypeFormOpen] = useState(false);
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [typeForm, setTypeFormState] = useState({ ...TBLANK });
  const [catForm, setCatFormState] = useState({ ...CBLANK });
  const [slugTouched, setSlugTouched] = useState(false);
  const [formError, setFormError] = useState(null);
  const [toast, setToast] = useState("");
  const seqRef = useRef(0);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const flash = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  };

  const setType = (patch) => {
    setTypeFormState((prev) => ({ ...prev, ...patch }));
    setFormError(null);
  };
  const setCat = (patch) => {
    setCatFormState((prev) => ({ ...prev, ...patch }));
    setFormError(null);
  };

  const catsOfType = (tId) => cats.filter((c) => c.category_type_id === tId);

  const isDescendant = (candidateId, ofId) => {
    let cur = cats.find((c) => c.id === candidateId);
    while (cur && cur.parent_category_id) {
      if (cur.parent_category_id === ofId) return true;
      cur = cats.find((c) => c.id === cur.parent_category_id);
    }
    return false;
  };

  const saveType = () => {
    const f = typeForm;
    if (!f.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    const slug = f.slug.trim() || slugify(f.name);
    if (types.some((t) => t.slug === slug && t.id !== f.id)) {
      setFormError("That slug is already taken by another type.");
      return;
    }
    const patch = { name: f.name.trim(), slug, description: f.description.trim(), status: f.status, updated_by: "You", updated_at: nowStamp() };
    if (f.id) {
      setTypes((prev) => prev.map((t) => (t.id === f.id ? { ...t, ...patch } : t)));
      setTypeFormOpen(false);
      setFormError(null);
      flash(`Saved "${patch.name}".`);
      return;
    }
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    const row = { id: `ct-new-${seq}`, ...patch, created_by: "You", created_at: nowStamp(), deleted_at: null };
    setTypes((prev) => prev.concat([row]));
    setTypeFormOpen(false);
    setFormError(null);
    setTypeId(row.id);
    flash(`Created "${patch.name}".`);
  };

  const saveCategory = () => {
    const f = catForm;
    if (!f.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!f.category_type_id) {
      setFormError("Pick a category type.");
      return;
    }
    const slug = f.slug.trim() || slugify(f.name);
    if (cats.some((c) => c.slug === slug && c.id !== f.id)) {
      setFormError("That slug is already in use.");
      return;
    }
    if (f.parent_category_id && (f.parent_category_id === f.id || isDescendant(f.parent_category_id, f.id))) {
      setFormError("That parent sits inside this category — pick another.");
      return;
    }
    const parent = cats.find((c) => c.id === f.parent_category_id);
    if (parent && parent.category_type_id !== f.category_type_id) {
      setFormError("Parent must belong to the same category type.");
      return;
    }
    const patch = {
      name: f.name.trim(),
      slug,
      description: f.description.trim(),
      category_type_id: f.category_type_id,
      parent_category_id: f.parent_category_id || null,
      status: f.status,
      updated_by: "You",
      updated_at: nowStamp(),
    };
    if (f.id) {
      setCats((prev) => prev.map((c) => (c.id === f.id ? { ...c, ...patch } : c)));
      setCatFormOpen(false);
      setFormError(null);
      flash(`Saved "${patch.name}".`);
      return;
    }
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    const row = { id: `c-new-${seq}`, ...patch, created_by: "You", created_at: nowStamp(), deleted_at: null };
    setCats((prev) => prev.concat([row]));
    setCatFormOpen(false);
    setFormError(null);
    setTypeId(patch.category_type_id);
    if (patch.parent_category_id) setCollapsed((prev) => ({ ...prev, [patch.parent_category_id]: false }));
    flash(`Created "${patch.name}".`);
  };

  const trashType = (id) => {
    const t = types.find((x) => x.id === id);
    if (!t.deleted_at && catsOfType(id).filter((c) => !c.deleted_at).length) {
      flash(`Move or trash its categories first — "${t.name}" is still in use.`);
      return;
    }
    const at = t.deleted_at ? null : nowStamp();
    setTypes((prev) => prev.map((x) => (x.id === id ? { ...x, deleted_at: at } : x)));
    flash(at ? `"${t.name}" moved to trash.` : `"${t.name}" restored.`);
  };

  const trashCategory = (id) => {
    const c = cats.find((x) => x.id === id);
    const at = c.deleted_at ? null : nowStamp();
    const kids = at ? cats.filter((x) => x.parent_category_id === id && !x.deleted_at).map((x) => x.id) : [];
    setCats((prev) => prev.map((x) => (x.id === id || kids.includes(x.id) ? { ...x, deleted_at: at } : x)));
    const tail = kids.length ? ` and ${kids.length} subcategor${kids.length === 1 ? "y" : "ies"}` : "";
    flash(at ? `"${c.name}"${tail} moved to trash.` : `"${c.name}" restored.`);
  };

  const editCategory = (c) => {
    setCatFormOpen(true);
    setTypeFormOpen(false);
    setFormError(null);
    setSlugTouched(true);
    setCatFormState({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      category_type_id: c.category_type_id,
      parent_category_id: c.parent_category_id || "",
      status: c.status,
    });
  };

  // ---- derived view ----
  const q = search.trim().toLowerCase();
  const typeName = (id) => {
    const t = types.find((x) => x.id === id);
    return t ? t.name : "—";
  };
  const activeType = types.find((t) => t.id === typeId) || null;

  const visibleCats = cats.filter((c) => showDeleted || !c.deleted_at);
  const typeCats = visibleCats.filter((c) => c.category_type_id === typeId);

  const matches = (c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (!q) return true;
    return `${c.name} ${c.slug} ${c.description || ""}`.toLowerCase().includes(q);
  };
  const keep = new Set();
  typeCats.forEach((c) => {
    if (!matches(c)) return;
    keep.add(c.id);
    let cur = c;
    while (cur && cur.parent_category_id) {
      keep.add(cur.parent_category_id);
      cur = cats.find((x) => x.id === cur.parent_category_id);
    }
  });

  const rows = [];
  const walk = (parentId, depth) => {
    typeCats
      .filter((c) => (c.parent_category_id || null) === parentId && keep.has(c.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((c) => {
        const kids = typeCats.filter((x) => x.parent_category_id === c.id && keep.has(x.id));
        const isCollapsed = !!collapsed[c.id];
        const used = CATEGORY_USAGE[c.id] || 0;
        rows.push({
          id: c.id,
          name: c.name,
          slug: c.slug,
          status: c.status,
          tone: TONE[c.status] || "neutral",
          isDeleted: !!c.deleted_at,
          weight: depth === 0 ? "var(--fw-semibold)" : "var(--fw-regular)",
          padLeft: `${16 + depth * 22}px`,
          bg: depth === 0 ? "var(--surface-card)" : "var(--surface-page)",
          opacity: c.deleted_at ? 0.55 : 1,
          chevron: kids.length ? (isCollapsed ? "▶" : "▼") : "•",
          chevronColor: kids.length ? "var(--text-secondary)" : "var(--border-strong)",
          chevronCursor: kids.length ? "pointer" : "default",
          onToggle: () => kids.length && setCollapsed((prev) => ({ ...prev, [c.id]: !prev[c.id] })),
          metaTail: (c.description ? ` · ${c.description}` : "") + (kids.length ? ` · ${kids.length} subcategories` : ""),
          usageLabel: used ? `${used} in use` : "unused",
          onAddChild: () => {
            setCatFormOpen(true);
            setTypeFormOpen(false);
            setFormError(null);
            setSlugTouched(false);
            setCatFormState({ ...CBLANK, category_type_id: c.category_type_id, parent_category_id: c.id });
          },
          onEdit: () => editCategory(c),
          onTrash: () => trashCategory(c.id),
          trashLabel: c.deleted_at ? "Restore" : "Trash",
          trashColor: c.deleted_at ? "var(--text-primary)" : "var(--red-700)",
        });
        if (!isCollapsed) walk(c.id, depth + 1);
      });
  };
  walk(null, 0);

  const cf = catForm;
  const parentPool = cats.filter((c) => !c.deleted_at && c.category_type_id === cf.category_type_id && c.id !== cf.id && !isDescendant(c.id, cf.id));
  const tf = typeForm;

  return {
    countLine: `${types.filter((t) => !t.deleted_at).length} types · ${cats.filter((c) => !c.deleted_at).length} categories`,

    typeRows: types.map((t) => {
      const liveCount = cats.filter((c) => c.category_type_id === t.id && !c.deleted_at).length;
      const selected = t.id === typeId;
      return {
        key: t.id,
        name: t.name,
        status: t.deleted_at ? "trashed" : t.status,
        tone: t.deleted_at ? "neutral" : TONE[t.status] || "neutral",
        metaLine: `${t.slug} · ${liveCount} categories`,
        bg: selected ? "var(--surface-sunken)" : "var(--surface-card)",
        stripe: selected ? "var(--orange-500)" : "transparent",
        weight: selected ? "var(--fw-semibold)" : "var(--fw-regular)",
        onSelect: () => {
          setTypeId(t.id);
          setSearch("");
        },
        onEdit: () => {
          setTypeFormOpen(true);
          setCatFormOpen(false);
          setFormError(null);
          setSlugTouched(true);
          setTypeFormState({ id: t.id, name: t.name, slug: t.slug, description: t.description || "", status: t.status });
        },
        onTrash: () => trashType(t.id),
        trashLabel: t.deleted_at ? "Restore" : "Trash",
        trashColor: t.deleted_at ? "var(--text-primary)" : "var(--red-700)",
      };
    }),

    rows,
    noRows: rows.length === 0,
    emptyMessage: q || statusFilter !== "all" ? "Nothing matches that filter." : "No categories in this type yet — create the first one.",
    paneTitle: activeType ? activeType.name : "Categories",
    paneSubtitle: activeType ? activeType.description || "Categories in this type" : "Pick a type on the left",

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusFilterOptions: [
      { value: "all", label: "All statuses" },
      { value: "active", label: "Active" },
      { value: "draft", label: "Draft" },
      { value: "inactive", label: "Inactive" },
    ],
    showDeleted,
    toggleDeleted: () => setShowDeleted((v) => !v),

    typeFormOpen,
    typeForm: tf,
    typeFormTitle: tf.id ? "Edit category type" : "New category type",
    typeSaveLabel: tf.id ? "Save type" : "Create type",
    typeFormMeta: tf.id ? `category_types.id ${tf.id}` : "slug auto-fills from the name",
    onTypeName: (e) => {
      const v = e.target.value;
      setType(slugTouched ? { name: v } : { name: v, slug: slugify(v) });
    },
    onTypeSlug: (e) => {
      setSlugTouched(true);
      setType({ slug: e.target.value });
    },
    onTypeDescription: (e) => setType({ description: e.target.value }),
    onTypeStatus: (e) => setType({ status: e.target.value }),
    saveType,

    catFormOpen,
    catForm: { ...cf, parent_category_id: cf.parent_category_id || "" },
    catFormTitle: cf.id ? "Edit category" : "New category",
    catFormSubtitle: cf.parent_category_id ? `Nested under ${(cats.find((c) => c.id === cf.parent_category_id) || {}).name || "—"}` : `Top level in ${typeName(cf.category_type_id) || "—"}`,
    catSaveLabel: cf.id ? "Save category" : "Create category",
    catFormMeta: cf.id ? `categories.id ${cf.id}` : "slug auto-fills from the name",
    onCatName: (e) => {
      const v = e.target.value;
      setCat(slugTouched ? { name: v } : { name: v, slug: slugify(v) });
    },
    onCatSlug: (e) => {
      setSlugTouched(true);
      setCat({ slug: e.target.value });
    },
    onCatDescription: (e) => setCat({ description: e.target.value }),
    onCatStatus: (e) => setCat({ status: e.target.value }),
    onCatType: (e) => setCat({ category_type_id: e.target.value, parent_category_id: "" }),
    onCatParent: (e) => setCat({ parent_category_id: e.target.value }),
    saveCategory,

    typeOptions: types.filter((t) => !t.deleted_at).map((t) => ({ value: t.id, label: t.name })),
    parentOptions: [{ value: "", label: "None — top level" }].concat(parentPool.map((c) => ({ value: c.id, label: c.name }))),
    statusOptions: [
      { value: "active", label: "Active" },
      { value: "draft", label: "Draft" },
      { value: "inactive", label: "Inactive" },
    ],

    openNewType: () => {
      setTypeFormOpen(true);
      setCatFormOpen(false);
      setFormError(null);
      setSlugTouched(false);
      setTypeFormState({ ...TBLANK });
    },
    openNewCategory: () => {
      setCatFormOpen(true);
      setTypeFormOpen(false);
      setFormError(null);
      setSlugTouched(false);
      setCatFormState({ ...CBLANK, category_type_id: typeId || (types[0] || {}).id || "" });
    },
    closeForms: () => {
      setTypeFormOpen(false);
      setCatFormOpen(false);
      setFormError(null);
    },
    formError,

    toast,
  };
}
