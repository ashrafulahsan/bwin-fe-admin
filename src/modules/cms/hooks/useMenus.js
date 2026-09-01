"use client";

import { useRef, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { MENUS, MENU_CATEGORIES } from "../constants/menus.mock";

const BLANK = {
  id: null,
  title: "",
  description: "",
  icon: "",
  image: "",
  link: "",
  parent_id: "",
  menu_category_id: "",
  order: 1,
  imageName: "",
};

const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function useMenus() {
  const [items, setItems] = useState(MENUS);
  const [baseline, setBaseline] = useState(MENUS);
  const [cat, setCat] = useState(MENU_CATEGORIES[0].id);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [collapsed, setCollapsed] = useState({});
  const [dragId, setDragId] = useState(null);
  const [dropId, setDropId] = useState(null);
  const [dropPos, setDropPos] = useState(null);
  const [rootDrop, setRootDrop] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [formError, setFormError] = useState(null);
  const [imageOver, setImageOver] = useState(false);
  const [trashId, setTrashId] = useState(null);
  const [dirty, setDirty] = useState(false);
  const { showSuccess, showWarning } = useToast();
  const seqRef = useRef(0);
  const fileRef = useRef(null);

  const live = () => items.filter((i) => i.menu_category_id === cat);

  const childrenOf = (parentId, list) =>
    (list || live()).filter((i) => (i.parent_id || null) === (parentId || null)).sort((a, b) => a.order - b.order);

  const isDescendant = (candidateId, ancestorId) => {
    let node = items.find((i) => i.id === candidateId);
    let guard = 0;
    while (node && node.parent_id && guard++ < 50) {
      if (node.parent_id === ancestorId) return true;
      node = items.find((i) => i.id === node.parent_id);
    }
    return false;
  };

  // Reparent + renumber siblings 1..n, mirroring ck_menus_order_positive.
  const move = (dId, targetId, pos) => {
    if (!dId) return;
    if (pos !== "root" && (dId === targetId || isDescendant(targetId, dId))) {
      showWarning("An item cannot be nested inside itself.");
      return;
    }
    const drag = items.find((i) => i.id === dId);
    if (!drag) return;
    const target = items.find((i) => i.id === targetId) || null;
    let newParent = null;
    if (pos === "inside") newParent = targetId;
    else if (pos !== "root") newParent = target ? target.parent_id || null : null;

    const sibs = live()
      .filter((i) => (i.parent_id || null) === newParent && i.id !== dId)
      .sort((a, b) => a.order - b.order);
    let idx = sibs.length;
    if (pos === "before" || pos === "after") {
      const at = sibs.findIndex((i) => i.id === targetId);
      idx = pos === "before" ? at : at + 1;
      if (at < 0) idx = sibs.length;
    }
    const ordered = sibs.slice();
    ordered.splice(idx, 0, drag);
    const orderMap = {};
    ordered.forEach((n, i) => {
      orderMap[n.id] = i + 1;
    });

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === dId) return { ...i, parent_id: newParent, order: orderMap[i.id], updated_by: "You" };
        if (orderMap[i.id]) return { ...i, order: orderMap[i.id] };
        return i;
      })
    );
    if (newParent) setCollapsed((prev) => ({ ...prev, [newParent]: false }));
    setDragId(null);
    setDropId(null);
    setDropPos(null);
    setRootDrop(false);
    setDirty(true);

    const label = pos === "inside" ? `nested under "${target.title}"` : pos === "root" ? "moved to the top level" : "reordered";
    showSuccess(`"${drag.title}" ${label}.`);
  };

  const nudge = (id, dir) => {
    const node = items.find((i) => i.id === id);
    const sibs = childrenOf(node.parent_id);
    const at = sibs.findIndex((i) => i.id === id);
    const to = at + dir;
    if (to < 0 || to >= sibs.length) return;
    move(id, sibs[to].id, dir < 0 ? "before" : "after");
  };

  const indent = (id) => {
    const node = items.find((i) => i.id === id);
    const sibs = childrenOf(node.parent_id);
    const at = sibs.findIndex((i) => i.id === id);
    if (at <= 0) {
      showWarning("Nothing above it to nest under.");
      return;
    }
    move(id, sibs[at - 1].id, "inside");
  };

  const outdent = (id) => {
    const node = items.find((i) => i.id === id);
    if (!node.parent_id) {
      showWarning("Already at the top level.");
      return;
    }
    move(id, node.parent_id, "after");
  };

  const takeImage = (file) => {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setFormError("That file is not an image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result, imageName: file.name }));
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    const f = form;
    if (!f.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    const ord = Math.max(1, parseInt(f.order, 10) || 1);
    const stamp = nowStamp();
    const patch = {
      title: f.title.trim(),
      description: f.description.trim(),
      icon: f.icon.trim(),
      image: f.image.trim(),
      link: f.link.trim(),
      parent_id: f.parent_id || null,
      menu_category_id: f.menu_category_id,
      order: ord,
      updated_by: "You",
      updated_at: stamp,
    };
    if (f.parent_id && (f.parent_id === f.id || isDescendant(f.parent_id, f.id))) {
      setFormError("That parent sits inside this item — pick another.");
      return;
    }
    if (f.id) {
      setItems((prev) => prev.map((i) => (i.id === f.id ? { ...i, ...patch } : i)));
      setFormOpen(false);
      setForm({ ...BLANK });
      setFormError(null);
      setDirty(true);
      showSuccess(`Saved "${patch.title}".`);
      return;
    }
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    const item = { id: `mn-new-${seq}`, ...patch, deleted_at: null, created_by: "You", created_at: stamp };
    setItems((prev) => prev.concat([item]));
    setFormOpen(false);
    setForm({ ...BLANK });
    setFormError(null);
    if (item.parent_id) setCollapsed((prev) => ({ ...prev, [item.parent_id]: false }));
    setDirty(true);
    showSuccess(`Added "${item.title}"${item.parent_id ? " as a submenu item." : " to the top level."}`);
  };

  // ---- derived view ----
  const catName = (id) => {
    const c = MENU_CATEGORIES.find((x) => x.id === id);
    return c ? c.name : "";
  };

  const q = search.trim().toLowerCase();
  const visible = (i) => (showDeleted || !i.deleted_at) && (!q || `${i.title} ${i.link || ""}`.toLowerCase().includes(q));

  const scoped = live();
  const matches = scoped.filter(visible);
  const keep = new Set(matches.map((i) => i.id));
  if (q) {
    matches.forEach((i) => {
      let p = i.parent_id;
      let guard = 0;
      while (p && guard++ < 50) {
        keep.add(p);
        const n = scoped.find((x) => x.id === p);
        p = n ? n.parent_id : null;
      }
    });
  }

  const rows = [];
  const walk = (parentId, depth) => {
    scoped
      .filter((i) => (i.parent_id || null) === (parentId || null) && keep.has(i.id))
      .sort((a, b) => a.order - b.order)
      .forEach((i) => {
        const kids = scoped.filter((k) => (k.parent_id || null) === i.id && keep.has(k.id));
        const isCollapsed = !!collapsed[i.id];
        const isDrop = dropId === i.id;
        rows.push({
          id: i.id,
          title: i.title,
          depth,
          padLeft: `${16 + depth * 26}px`,
          titleWeight: depth === 0 ? "var(--fw-semibold)" : "var(--fw-regular)",
          hasChildren: kids.length > 0,
          childLabel: kids.length === 1 ? "1 submenu item" : `${kids.length} submenu items`,
          chevron: kids.length ? (isCollapsed ? "▸" : "▾") : "·",
          chevronColor: kids.length ? "var(--text-secondary)" : "var(--gray-300)",
          chevronCursor: kids.length ? "pointer" : "default",
          onToggle: () => kids.length && setCollapsed((prev) => ({ ...prev, [i.id]: !prev[i.id] })),
          linkLabel: i.link || "—",
          noLink: !i.link && depth > 0,
          metaTail: (i.icon ? `  ·  icon: ${i.icon}` : "") + (i.description ? `  ·  ${i.description}` : ""),
          orderLabel: `#${i.order}`,
          isDeleted: !!i.deleted_at,
          opacity: i.deleted_at ? "0.55" : "1",
          bg: dragId === i.id ? "var(--gray-100)" : isDrop && dropPos === "inside" ? "var(--orange-50)" : "transparent",
          topLine: isDrop && dropPos === "before" ? "var(--orange-500)" : "transparent",
          bottomLine: isDrop && dropPos === "after" ? "var(--orange-500)" : "var(--border)",
          trashLabel: i.deleted_at ? "Restore" : "Trash",
          trashColor: i.deleted_at ? "var(--text-primary)" : "var(--red-700)",
          onDragStart: (e) => {
            e.dataTransfer.effectAllowed = "move";
            setDragId(i.id);
          },
          onDragEnd: () => {
            setDragId(null);
            setDropId(null);
            setDropPos(null);
            setRootDrop(false);
          },
          onDragOver: (e) => {
            e.preventDefault();
            if (!dragId || dragId === i.id) return;
            const r = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientY - r.top) / r.height;
            const pos = ratio < 0.3 ? "before" : ratio > 0.7 ? "after" : "inside";
            if (dropId !== i.id || dropPos !== pos) {
              setDropId(i.id);
              setDropPos(pos);
              setRootDrop(false);
            }
          },
          onDragLeave: () => {
            if (dropId === i.id) {
              setDropId(null);
              setDropPos(null);
            }
          },
          onDrop: (e) => {
            e.preventDefault();
            move(dragId, i.id, dropPos || "after");
          },
          onUp: () => nudge(i.id, -1),
          onDown: () => nudge(i.id, 1),
          onIndent: () => indent(i.id),
          onOutdent: () => outdent(i.id),
          onAddChild: () => {
            setFormOpen(true);
            setFormError(null);
            setForm({ ...BLANK, menu_category_id: cat, parent_id: i.id, order: kids.length + 1 });
          },
          onEdit: () => {
            setFormOpen(true);
            setFormError(null);
            setForm({
              id: i.id,
              title: i.title,
              description: i.description || "",
              icon: i.icon || "",
              image: i.image || "",
              imageName: "",
              link: i.link || "",
              parent_id: i.parent_id || "",
              menu_category_id: i.menu_category_id,
              order: i.order,
            });
          },
          onTrash: () => {
            if (i.deleted_at) {
              setItems((prev) => prev.map((x) => (x.id === i.id ? { ...x, deleted_at: null } : x)));
              setDirty(true);
              showSuccess(`Restored "${i.title}".`);
            } else {
              setTrashId(i.id);
            }
          },
        });
        if (!isCollapsed) walk(i.id, depth + 1);
      });
  };
  walk(null, 0);

  const tops = childrenOf(null).filter((i) => !i.deleted_at);
  const previewTree = tops.map((t) => ({
    title: t.title,
    children: childrenOf(t.id)
      .filter((c) => !c.deleted_at)
      .map((c) => ({ title: c.title, pad: "12px" })),
  }));

  const activeScoped = scoped.filter((i) => !i.deleted_at);
  const orphanLinks = activeScoped.filter((i) => !i.link && !activeScoped.some((k) => k.parent_id === i.id)).length;
  const depthOf = (i) => {
    let d = 0;
    let p = i.parent_id;
    let g = 0;
    while (p && g++ < 50) {
      d++;
      const n = scoped.find((x) => x.id === p);
      p = n ? n.parent_id : null;
    }
    return d;
  };
  const maxDepth = activeScoped.reduce((m, i) => Math.max(m, depthOf(i) + 1), 0);

  const pending = items.find((i) => i.id === trashId) || null;
  const pendingKids = pending ? items.filter((i) => i.parent_id === pending.id && !i.deleted_at).length : 0;

  const f = form;
  const parentPool = items.filter((i) => i.menu_category_id === (f.menu_category_id || cat) && !i.deleted_at && i.id !== f.id && !isDescendant(i.id, f.id));

  return {
    countLine: `${activeScoped.length} items in ${catName(cat)}`,
    categoryCards: MENU_CATEGORIES.map((c) => {
      const own = items.filter((i) => i.menu_category_id === c.id && !i.deleted_at);
      return {
        key: c.id,
        name: c.name,
        hint: c.hint,
        countLabel: `${own.length} items`,
        border: cat === c.id ? "var(--orange-500)" : "var(--border)",
        bg: cat === c.id ? "var(--surface-card)" : "var(--surface-sunken)",
        onSelect: () => {
          setCat(c.id);
          setSearch("");
        },
      };
    }),

    rows,
    noRows: rows.length === 0,
    emptyMessage: q ? `Nothing in ${catName(cat)} matches "${search}".` : `${catName(cat)} has no items yet — add the first one.`,

    search,
    setSearch,
    showDeleted,
    toggleDeleted: () => setShowDeleted((v) => !v),
    expandAll: () => setCollapsed({}),
    collapseAll: () => {
      const next = {};
      scoped.forEach((i) => {
        if (scoped.some((k) => k.parent_id === i.id)) next[i.id] = true;
      });
      setCollapsed(next);
    },

    dirty,
    saveOrder: () => {
      setBaseline(items);
      setDirty(false);
      showSuccess("Order saved — menus table updated.");
    },
    revertOrder: () => {
      setItems(baseline);
      setDirty(false);
      setCollapsed({});
      showSuccess("Reverted to the last saved order.");
    },

    rootDropBg: rootDrop ? "var(--orange-50)" : "var(--surface-sunken)",
    onRootDragOver: (e) => {
      e.preventDefault();
      if (!rootDrop) {
        setRootDrop(true);
        setDropId(null);
        setDropPos(null);
      }
    },
    onRootDrop: (e) => {
      e.preventDefault();
      move(dragId, null, "root");
    },

    previewTitle: `${catName(cat)} preview`,
    previewSubtitle: `${tops.length} top-level items · ${maxDepth} levels deep`,
    previewTop: tops.slice(0, 5),
    previewTree,
    health: [
      { label: "Top-level items", value: String(tops.length), color: "var(--text-primary)" },
      { label: "Nesting depth", value: String(maxDepth), color: maxDepth > 3 ? "var(--state-warning)" : "var(--text-primary)" },
      { label: "Items without a link", value: String(orphanLinks), color: orphanLinks ? "var(--state-warning)" : "var(--state-success)" },
      { label: "In trash", value: String(scoped.filter((i) => i.deleted_at).length), color: "var(--text-muted)" },
    ],

    formOpen,
    form: { ...f, parent_id: f.parent_id || "" },
    formTitle: f.id ? "Edit menu item" : "New menu item",
    formSubtitle: f.id ? `menus.${f.id}` : "Pick a category and, optionally, a parent to make it a submenu",
    formError,
    openCreateRoot: () => {
      setFormOpen(true);
      setFormError(null);
      setForm({ ...BLANK, menu_category_id: cat, order: childrenOf(null).length + 1 });
    },
    closeForm: () => {
      setFormOpen(false);
      setForm({ ...BLANK });
      setFormError(null);
    },
    categoryOptions: MENU_CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
    parentOptions: [{ value: "", label: "No parent — top level" }].concat(
      parentPool.map((i) => ({ value: i.id, label: (i.parent_id ? "— " : "") + i.title }))
    ),
    setFormField: (key, value) => {
      if (key === "menu_category_id") {
        setForm((prev) => ({ ...prev, menu_category_id: value, parent_id: "" }));
        return;
      }
      setForm((prev) => ({ ...prev, [key]: value }));
      if (key === "title" || key === "parent_id") setFormError(null);
    },
    fileRef,
    pickImage: () => fileRef.current && fileRef.current.click(),
    onImageFile: (e) => takeImage(e.target.files && e.target.files[0]),
    clearImage: () => setForm((prev) => ({ ...prev, image: "", imageName: "" })),
    hasImage: !!f.image,
    imagePreviewCss: f.image ? `url("${String(f.image).replace(/"/g, "%22")}")` : "none",
    imagePlaceholderLabel: f.image ? "" : "No image",
    uploadLabel: f.image ? "Replace image" : "Upload image",
    imageHint: f.image ? f.imageName || f.image : "Drag a file here or upload — PNG or SVG, 96×96 for icons, 480×320 for dropdown cards.",
    imageDropBorder: imageOver ? "var(--orange-500)" : "var(--border-strong)",
    imageDropBg: imageOver ? "var(--orange-50)" : "var(--surface-sunken)",
    onImageDragOver: (e) => {
      e.preventDefault();
      if (!imageOver) setImageOver(true);
    },
    onImageDragLeave: () => setImageOver(false),
    onImageDrop: (e) => {
      e.preventDefault();
      setImageOver(false);
      takeImage(e.dataTransfer.files && e.dataTransfer.files[0]);
    },
    submitLabel: f.id ? "Save item" : "Add item",
    submitForm: save,

    trashOpen: !!pending,
    trashMessage: pending
      ? `"${pending.title}" gets a deleted_at stamp${pendingKids ? ` along with its ${pendingKids} submenu item${pendingKids === 1 ? "" : "s"}` : ""}. You can restore it from the trash view.`
      : "",
    cancelTrash: () => setTrashId(null),
    confirmTrash: () => {
      const id = trashId;
      const stamp = nowStamp();
      const ids = new Set([id]);
      let added = true;
      let guard = 0;
      while (added && guard++ < 20) {
        added = false;
        items.forEach((i) => {
          if (i.parent_id && ids.has(i.parent_id) && !ids.has(i.id)) {
            ids.add(i.id);
            added = true;
          }
        });
      }
      setItems((prev) => prev.map((i) => (ids.has(i.id) ? { ...i, deleted_at: stamp, updated_at: stamp, updated_by: "You" } : i)));
      setTrashId(null);
      setDirty(true);
      showSuccess(`Moved ${ids.size} item${ids.size === 1 ? "" : "s"} to trash.`);
    },
  };
}
