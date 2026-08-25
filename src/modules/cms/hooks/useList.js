"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "@/utils/slugify";
import { CATEGORIES } from "../constants/taxonomy.mock";
import { LIST_ENABLED_CATEGORY_IDS, MASTER_CRUD_FIELDS, MASTER_CRUDS, MASTER_CRUD_FIELD_VALUES } from "../constants/masterCruds.mock";

const EBLANK = { id: null, title: "", slug: "", description: "", link: "", category_id: "", order: 1, status: "active" };
const FBLANK = { id: null, category_id: "", field_name: "", field_type: "text", field_requiredness: false, status: "active", optionsText: "" };
const TONE = { active: "success", draft: "warning", inactive: "neutral" };
const INPUT_TYPE = { text: "text", number: "number", date: "date", time: "time", url: "url", image: "text" };
const FIELD_TYPES = ["text", "textarea", "number", "date", "time", "url", "select", "boolean", "image"];

const CATS = LIST_ENABLED_CATEGORY_IDS.map((id) => CATEGORIES.find((c) => c.id === id)).filter(Boolean);

const initialValues = () => {
  const values = {};
  MASTER_CRUD_FIELD_VALUES.forEach((v) => {
    values[`${v.master_crud_id}|${v.master_crud_field_id}`] = v.value;
  });
  return values;
};

const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function useList() {
  const [entries, setEntries] = useState(MASTER_CRUDS);
  const [fields, setFields] = useState(MASTER_CRUD_FIELDS);
  const [values, setValues] = useState(initialValues);
  const [catId, setCatId] = useState((CATS[0] || {}).id || null);
  const [tab, setTab] = useState("entries");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [entryFormOpen, setEntryFormOpen] = useState(false);
  const [fieldFormOpen, setFieldFormOpen] = useState(false);
  const [entryForm, setEntryForm] = useState({ ...EBLANK });
  const [fieldForm, setFieldForm] = useState({ ...FBLANK });
  const [formValues, setFormValues] = useState({});
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

  const liveFields = (cId) => fields.filter((f) => f.category_id === cId && !f.deleted_at && f.status !== "inactive");

  const openEntry = (entry, cId) => {
    const cid = entry ? entry.category_id : cId;
    const fv = {};
    liveFields(cid).forEach((f) => {
      fv[f.id] = entry ? values[`${entry.id}|${f.id}`] || "" : "";
    });
    const siblings = entries.filter((e) => e.category_id === cid && !e.deleted_at);
    setEntryFormOpen(true);
    setFieldFormOpen(false);
    setFormError(null);
    setSlugTouched(!!entry);
    setFormValues(fv);
    setEntryForm(
      entry
        ? { id: entry.id, title: entry.title, slug: entry.slug, description: entry.description || "", link: entry.link || "", category_id: entry.category_id, order: entry.order, status: entry.status }
        : { ...EBLANK, category_id: cid, order: siblings.length + 1 }
    );
  };

  const saveEntry = () => {
    const f = entryForm;
    if (!f.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!f.category_id) {
      setFormError("Pick a category.");
      return;
    }
    const slug = f.slug.trim() || slugify(f.title);
    if (entries.some((e) => e.slug === slug && e.id !== f.id)) {
      setFormError("That slug is already used by another entry.");
      return;
    }
    const missing = liveFields(f.category_id).filter((x) => x.field_requiredness && x.field_type !== "boolean" && !String(formValues[x.id] || "").trim());
    if (missing.length) {
      setFormError(`${missing[0].field_name} is required for this category.`);
      return;
    }
    const order = Math.max(1, parseInt(f.order, 10) || 1);
    const patch = {
      title: f.title.trim(),
      slug,
      description: f.description.trim(),
      link: f.link.trim(),
      category_id: f.category_id,
      order,
      status: f.status,
      updated_by: "You",
      updated_at: nowStamp(),
    };
    const seq = f.id ? seqRef.current : seqRef.current + 1;
    const id = f.id || `mc-new-${seq}`;
    const valuePatch = {};
    Object.keys(formValues).forEach((fid) => {
      valuePatch[`${id}|${fid}`] = formValues[fid];
    });

    setEntries((prev) => (f.id ? prev.map((e) => (e.id === f.id ? { ...e, ...patch } : e)) : prev.concat([{ id, ...patch, created_by: "You", created_at: nowStamp(), deleted_at: null }])));
    setValues((prev) => ({ ...prev, ...valuePatch }));
    seqRef.current = seq;
    setCatId(patch.category_id);
    setEntryFormOpen(false);
    setFormError(null);
    flash(`${f.id ? "Saved" : "Created"} "${patch.title}".`);
  };

  const duplicate = (entry) => {
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    const id = `mc-new-${seq}`;
    const siblings = entries.filter((e) => e.category_id === entry.category_id && !e.deleted_at);
    const stamp = nowStamp();
    const copy = {
      ...entry,
      id,
      title: `${entry.title} (copy)`,
      slug: `${entry.slug}-copy-${seq}`,
      status: "draft",
      order: siblings.length + 1,
      created_by: "You",
      created_at: stamp,
      updated_by: "You",
      updated_at: stamp,
      deleted_at: null,
    };
    const valuePatch = {};
    fields
      .filter((f) => f.category_id === entry.category_id)
      .forEach((f) => {
        const v = values[`${entry.id}|${f.id}`];
        if (v !== undefined) valuePatch[`${id}|${f.id}`] = v;
      });
    setEntries((prev) => prev.concat([copy]));
    setValues((prev) => ({ ...prev, ...valuePatch }));
    flash("Duplicated as a draft.");
  };

  const trashEntry = (id) => {
    const e = entries.find((x) => x.id === id);
    const at = e.deleted_at ? null : nowStamp();
    setEntries((prev) => prev.map((x) => (x.id === id ? { ...x, deleted_at: at } : x)));
    flash(at ? `"${e.title}" moved to trash.` : `"${e.title}" restored.`);
  };

  const nudge = (id, dir) => {
    const e = entries.find((x) => x.id === id);
    const sibs = entries.filter((x) => x.category_id === e.category_id && !x.deleted_at).sort((a, b) => a.order - b.order);
    const at = sibs.findIndex((x) => x.id === id);
    const to = at + dir;
    if (to < 0 || to >= sibs.length) return;
    const other = sibs[to];
    setEntries((prev) =>
      prev.map((x) => {
        if (x.id === e.id) return { ...x, order: other.order };
        if (x.id === other.id) return { ...x, order: e.order };
        return x;
      })
    );
  };

  const saveField = () => {
    const f = fieldForm;
    if (!f.field_name.trim()) {
      setFormError("Field name is required.");
      return;
    }
    if (!f.category_id) {
      setFormError("Pick a category.");
      return;
    }
    if (fields.some((x) => x.category_id === f.category_id && x.field_name.toLowerCase() === f.field_name.trim().toLowerCase() && x.id !== f.id)) {
      setFormError("This category already has a field with that name.");
      return;
    }
    const options = f.field_type === "select" ? f.optionsText.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
    if (f.field_type === "select" && !options.length) {
      setFormError("Add at least one choice for a select field.");
      return;
    }
    const patch = {
      category_id: f.category_id,
      field_name: f.field_name.trim(),
      field_type: f.field_type,
      field_requiredness: !!f.field_requiredness,
      status: f.status,
      options,
      updated_by: "You",
      updated_at: nowStamp(),
    };
    if (f.id) {
      setFields((prev) => prev.map((x) => (x.id === f.id ? { ...x, ...patch } : x)));
      setFieldFormOpen(false);
      setFormError(null);
      flash(`Saved field "${patch.field_name}".`);
      return;
    }
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    setFields((prev) => prev.concat([{ id: `f-new-${seq}`, ...patch, created_by: "You", created_at: nowStamp(), deleted_at: null }]));
    setFieldFormOpen(false);
    setFormError(null);
    setCatId(patch.category_id);
    setTab("fields");
    flash(`Added "${patch.field_name}" to this category.`);
  };

  const trashField = (id) => {
    const f = fields.find((x) => x.id === id);
    const at = f.deleted_at ? null : nowStamp();
    setFields((prev) => prev.map((x) => (x.id === id ? { ...x, deleted_at: at } : x)));
    flash(at ? `"${f.field_name}" removed from the form. Stored values are kept.` : `"${f.field_name}" restored.`);
  };

  // ---- derived view ----
  const q = search.trim().toLowerCase();
  const activeCat = CATS.find((c) => c.id === catId) || null;
  const catFields = fields.filter((f) => f.category_id === catId && !f.deleted_at);
  const liveFieldsOfCat = liveFields(catId);

  const entriesOfCat = entries
    .filter((e) => e.category_id === catId)
    .filter((e) => showDeleted || !e.deleted_at)
    .filter((e) => statusFilter === "all" || e.status === statusFilter)
    .filter((e) => {
      if (!q) return true;
      const extra = liveFieldsOfCat.map((f) => values[`${e.id}|${f.id}`] || "").join(" ");
      return `${e.title} ${e.slug} ${e.description || ""} ${extra}`.toLowerCase().includes(q);
    })
    .sort((a, b) => a.order - b.order);

  const entryRows = entriesOfCat.map((e) => {
    const missing = liveFieldsOfCat.filter((f) => f.field_requiredness && f.field_type !== "boolean" && !String(values[`${e.id}|${f.id}`] || "").trim());
    const chips = liveFieldsOfCat.slice(0, 3).map((f) => {
      let v = values[`${e.id}|${f.id}`] || "";
      if (f.field_type === "boolean") v = v === "true" ? "Yes" : "No";
      return { label: f.field_name, value: v || "—" };
    });
    return {
      id: e.id,
      order: e.order,
      title: e.title,
      slug: e.slug,
      status: e.status,
      tone: TONE[e.status] || "neutral",
      isDeleted: !!e.deleted_at,
      opacity: e.deleted_at ? 0.55 : 1,
      metaTail: (e.link ? ` · ${e.link}` : "") + (e.description ? ` · ${e.description}` : "") + ` · updated ${e.updated_at} by ${e.updated_by}`,
      chips,
      incomplete: missing.length > 0,
      incompleteLabel: missing.length === 1 ? `Missing ${missing[0].field_name}` : `Missing ${missing.length} fields`,
      onUp: () => nudge(e.id, -1),
      onDown: () => nudge(e.id, 1),
      onEdit: () => openEntry(e),
      onDuplicate: () => duplicate(e),
      onTrash: () => trashEntry(e.id),
      trashLabel: e.deleted_at ? "Restore" : "Trash",
    };
  });

  const ef = entryForm;
  const formFieldDefs = liveFields(ef.category_id);
  const setValue = (fid, v) => {
    setFormValues((prev) => ({ ...prev, [fid]: v }));
    setFormError(null);
  };

  const formFields = formFieldDefs.map((f) => {
    const v = formValues[f.id] || "";
    const wide = f.field_type === "textarea";
    return {
      key: f.id,
      label: f.field_name + (f.field_requiredness ? " *" : ""),
      span: wide ? "1/-1" : "auto",
      isInput: ["text", "number", "date", "time", "url", "image"].includes(f.field_type),
      isTextarea: f.field_type === "textarea",
      isSelect: f.field_type === "select",
      isBoolean: f.field_type === "boolean",
      inputType: INPUT_TYPE[f.field_type] || "text",
      placeholder: f.field_type === "image" ? "file name or path" : "",
      options: [{ value: "", label: "Not set" }].concat((f.options || []).map((o) => ({ value: o, label: o }))),
      value: v,
      checked: v === "true",
      boolLabel: v === "true" ? "Yes" : "No",
      hint: f.field_type === "image" ? "Stored as a media reference in master_crud_field_values." : "",
      onChange: (e) => setValue(f.id, e.target.value),
      onToggle: (e) => setValue(f.id, e.target.checked ? "true" : "false"),
    };
  });

  const ff = fieldForm;

  return {
    countLine: `${CATS.length} categories · ${entries.filter((e) => !e.deleted_at).length} entries`,
    newEntryLabel: activeCat ? `New ${activeCat.name.toLowerCase()} entry` : "New entry",

    categoryRows: CATS.map((c) => {
      const live = entries.filter((e) => e.category_id === c.id && !e.deleted_at).length;
      const fieldCount = fields.filter((f) => f.category_id === c.id && !f.deleted_at).length;
      const selected = c.id === catId;
      return {
        key: c.id,
        name: c.name,
        countLabel: `${live} entries`,
        metaLine: `${c.slug} · ${fieldCount} extra fields`,
        bg: selected ? "var(--surface-sunken)" : "var(--surface-card)",
        stripe: selected ? "var(--orange-500)" : "transparent",
        weight: selected ? "var(--fw-semibold)" : "var(--fw-regular)",
        onSelect: () => {
          setCatId(c.id);
          setSearch("");
        },
      };
    }),

    paneTitle: activeCat ? activeCat.name : "Entries",
    paneSubtitle: activeCat ? activeCat.description || "Entries in this category" : "Pick a category on the left",
    onEntries: tab === "entries",
    onFields: tab === "fields",
    showEntriesTab: () => setTab("entries"),
    showFieldsTab: () => setTab("fields"),
    fieldsTabLabel: `Fields (${catFields.length})`,
    entriesTabBg: tab === "entries" ? "var(--surface-card)" : "transparent",
    entriesTabColor: tab === "entries" ? "var(--text-primary)" : "var(--text-muted)",
    fieldsTabBg: tab === "fields" ? "var(--surface-card)" : "transparent",
    fieldsTabColor: tab === "fields" ? "var(--text-primary)" : "var(--text-muted)",

    entryRows,
    noEntries: entryRows.length === 0,
    emptyMessage: q || statusFilter !== "all" ? "Nothing matches that filter." : "Nothing here yet — add the first entry.",

    fieldRows: catFields.map((f) => ({
      key: f.id,
      name: f.field_name,
      type: f.field_type,
      required: f.field_requiredness,
      status: f.deleted_at ? "removed" : f.status,
      tone: f.deleted_at ? "neutral" : TONE[f.status] || "neutral",
      opacity: f.deleted_at ? 0.55 : 1,
      metaLine:
        (f.options && f.options.length ? `Choices: ${f.options.join(", ")} · ` : "") +
        `${entries.filter((e) => e.category_id === f.category_id && String(values[`${e.id}|${f.id}`] || "").trim()).length} entries filled`,
      onEdit: () => {
        setFieldFormOpen(true);
        setEntryFormOpen(false);
        setFormError(null);
        setFieldForm({ id: f.id, category_id: f.category_id, field_name: f.field_name, field_type: f.field_type, field_requiredness: f.field_requiredness, status: f.status, optionsText: (f.options || []).join(", ") });
      },
      onTrash: () => trashField(f.id),
      trashLabel: f.deleted_at ? "Restore" : "Remove",
    })),
    noFields: catFields.length === 0,

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

    entryFormOpen,
    entryForm: ef,
    entryFormTitle: ef.id ? "Edit entry" : "New entry",
    entryFormSubtitle: (CATS.find((c) => c.id === ef.category_id) || {}).name || "Pick a category",
    entrySaveLabel: ef.id ? "Save entry" : "Create entry",
    entryFormMeta: ef.id ? `master_cruds.id ${ef.id}` : "slug auto-fills from the title",
    onEntryTitle: (e) => {
      const v = e.target.value;
      setEntryForm((prev) => ({ ...prev, title: v, slug: slugTouched ? prev.slug : slugify(v) }));
      setFormError(null);
    },
    onEntrySlug: (e) => {
      const v = e.target.value;
      setEntryForm((prev) => ({ ...prev, slug: v }));
      setSlugTouched(true);
      setFormError(null);
    },
    onEntryDescription: (e) => setEntryForm((prev) => ({ ...prev, description: e.target.value })),
    onEntryLink: (e) => setEntryForm((prev) => ({ ...prev, link: e.target.value })),
    onEntryOrder: (e) => setEntryForm((prev) => ({ ...prev, order: e.target.value })),
    onEntryStatus: (e) => setEntryForm((prev) => ({ ...prev, status: e.target.value })),
    onEntryCategory: (e) => {
      const v = e.target.value;
      const fv = {};
      liveFields(v).forEach((f) => {
        fv[f.id] = "";
      });
      setEntryForm((prev) => ({ ...prev, category_id: v }));
      setFormValues(fv);
      setFormError(null);
    },
    hasCustomFields: formFields.length > 0,
    customFieldsHeading: `${(CATS.find((c) => c.id === ef.category_id) || {}).name || "Category"} fields`,
    formFields,
    saveEntry,

    fieldFormOpen,
    fieldForm: ff,
    fieldFormTitle: ff.id ? "Edit field" : "New field",
    fieldFormSubtitle: "Applies to every entry in the chosen category.",
    fieldSaveLabel: ff.id ? "Save field" : "Add field",
    fieldFormMeta: ff.id ? `master_crud_fields.id ${ff.id}` : "stored in master_crud_fields",
    fieldNeedsOptions: ff.field_type === "select",
    onFieldName: (e) => {
      setFieldForm((prev) => ({ ...prev, field_name: e.target.value }));
      setFormError(null);
    },
    onFieldType: (e) => {
      setFieldForm((prev) => ({ ...prev, field_type: e.target.value }));
      setFormError(null);
    },
    onFieldCategory: (e) => {
      setFieldForm((prev) => ({ ...prev, category_id: e.target.value }));
      setFormError(null);
    },
    onFieldStatus: (e) => setFieldForm((prev) => ({ ...prev, status: e.target.value })),
    onFieldOptions: (e) => {
      setFieldForm((prev) => ({ ...prev, optionsText: e.target.value }));
      setFormError(null);
    },
    onFieldRequired: (e) => setFieldForm((prev) => ({ ...prev, field_requiredness: e.target.checked })),
    saveField,

    categoryOptions: CATS.map((c) => ({ value: c.id, label: c.name })),
    statusOptions: [
      { value: "active", label: "Active" },
      { value: "draft", label: "Draft" },
      { value: "inactive", label: "Inactive" },
    ],
    fieldTypeOptions: FIELD_TYPES.map((t) => ({ value: t, label: t })),

    openNewEntry: () => openEntry(null, catId),
    openNewField: () => {
      setFieldFormOpen(true);
      setEntryFormOpen(false);
      setFormError(null);
      setFieldForm({ ...FBLANK, category_id: catId || "" });
    },
    closeForms: () => {
      setEntryFormOpen(false);
      setFieldFormOpen(false);
      setFormError(null);
    },
    formError,

    toast,
  };
}
