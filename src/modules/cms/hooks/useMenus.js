"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { createMenu, deleteMenu, getMenuCategories, getMenus, restoreMenu, updateMenu } from "../services";

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
};

// A navigation is "small and shallow" by design (see the menus module's
// docstrings) — one page comfortably holds a whole category's tree, so
// there is no pagination UI here, just a page_size high enough that a
// single fetch always covers it.
const CATEGORY_PAGE_SIZE = 100;

const errorMessage = (error, fallback) => error?.response?.data?.message || fallback;

export function useMenus() {
  const { showSuccess, showWarning, showError } = useToast();
  const queryClient = useQueryClient();

  const [cat, setCat] = useState(null);
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
  const [trashId, setTrashId] = useState(null);

  const categoriesQuery = useQuery({ queryKey: ["menuCategories"], queryFn: getMenuCategories });
  const categories = categoriesQuery.data || [];

  const firstCategoryId = categoriesQuery.data?.[0]?.id;
  useEffect(() => {
    if (!cat && firstCategoryId) {
      // Seeding the selected tab from the fetched list, once, when it
      // arrives — not deriving render output, so the effect is warranted here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCat(firstCategoryId);
    }
  }, [cat, firstCategoryId]);

  const menusQuery = useQuery({
    queryKey: ["menus", cat, showDeleted],
    queryFn: () => getMenus({ menu_category_id: cat, include_deleted: showDeleted, page_size: CATEGORY_PAGE_SIZE }),
    enabled: !!cat,
    placeholderData: (prev) => prev,
  });

  // Per-category counts for the cards above the tree — one cheap,
  // meta-only request per category (page_size: 1) rather than a new
  // aggregate endpoint.
  const countsQuery = useQuery({
    queryKey: ["menuCounts", categories.map((c) => c.id)],
    queryFn: () =>
      Promise.all(
        categories.map((c) =>
          getMenus({ menu_category_id: c.id, page_size: 1 }).then((page) => [c.id, page.meta?.total_items ?? 0])
        )
      ).then((pairs) => Object.fromEntries(pairs)),
    enabled: categories.length > 0,
  });
  const counts = countsQuery.data || {};

  const invalidateMenus = () => queryClient.invalidateQueries({ queryKey: ["menus", cat] });
  const invalidateCounts = () => queryClient.invalidateQueries({ queryKey: ["menuCounts"] });

  const items = () => menusQuery.data?.items || [];

  const childrenOf = (parentId, list) =>
    (list || items()).filter((i) => (i.parent_id || null) === (parentId || null)).sort((a, b) => a.order - b.order);

  const isDescendant = (candidateId, ancestorId) => {
    let node = items().find((i) => i.id === candidateId);
    let guard = 0;
    while (node && node.parent_id && guard++ < 50) {
      if (node.parent_id === ancestorId) return true;
      node = items().find((i) => i.id === node.parent_id);
    }
    return false;
  };

  // -- Mutations --------------------------------------------------------

  const moveMutation = useMutation({
    mutationFn: (writes) => Promise.all(writes.map(({ id, patch }) => updateMenu(id, patch))),
    onSuccess: () => {
      invalidateMenus();
    },
    onError: (error) => {
      showError(errorMessage(error, "Couldn't reorder that item."));
      invalidateMenus();
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }) => (id ? updateMenu(id, payload) : createMenu(payload)),
    onSuccess: () => {
      invalidateMenus();
      invalidateCounts();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      invalidateMenus();
      invalidateCounts();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreMenu,
    onSuccess: () => {
      invalidateMenus();
      invalidateCounts();
    },
  });

  // Reparent + renumber siblings 1..n, mirroring ck_menus_order_positive.
  // The backend only ever repositions the item you patch — it never shifts
  // its new siblings for you — so every sibling whose position actually
  // changes gets its own PATCH, batched into one mutation.
  const move = (dId, targetId, pos) => {
    if (!dId) return;
    if (pos !== "root" && (dId === targetId || isDescendant(targetId, dId))) {
      showWarning("An item cannot be nested inside itself.");
      return;
    }
    const all = items();
    const drag = all.find((i) => i.id === dId);
    if (!drag) return;
    const target = all.find((i) => i.id === targetId) || null;
    let newParent = null;
    if (pos === "inside") newParent = targetId;
    else if (pos !== "root") newParent = target ? target.parent_id || null : null;

    const sibs = all.filter((i) => (i.parent_id || null) === newParent && i.id !== dId).sort((a, b) => a.order - b.order);
    let idx = sibs.length;
    if (pos === "before" || pos === "after") {
      const at = sibs.findIndex((i) => i.id === targetId);
      idx = pos === "before" ? at : at + 1;
      if (at < 0) idx = sibs.length;
    }
    const ordered = sibs.slice();
    ordered.splice(idx, 0, drag);

    const writes = [];
    ordered.forEach((n, i) => {
      const order = i + 1;
      if (n.id === dId) writes.push({ id: n.id, patch: { parent_id: newParent, order } });
      else if (n.order !== order) writes.push({ id: n.id, patch: { order } });
    });

    setDragId(null);
    setDropId(null);
    setDropPos(null);
    setRootDrop(false);

    const label = pos === "inside" ? `nested under "${target.title}"` : pos === "root" ? "moved to the top level" : "reordered";
    moveMutation.mutate(writes, { onSuccess: () => showSuccess(`"${drag.title}" ${label}.`) });
  };

  const nudge = (id, dir) => {
    const node = items().find((i) => i.id === id);
    const sibs = childrenOf(node.parent_id);
    const at = sibs.findIndex((i) => i.id === id);
    const to = at + dir;
    if (to < 0 || to >= sibs.length) return;
    move(id, sibs[to].id, dir < 0 ? "before" : "after");
  };

  const indent = (id) => {
    const node = items().find((i) => i.id === id);
    const sibs = childrenOf(node.parent_id);
    const at = sibs.findIndex((i) => i.id === id);
    if (at <= 0) {
      showWarning("Nothing above it to nest under.");
      return;
    }
    move(id, sibs[at - 1].id, "inside");
  };

  const outdent = (id) => {
    const node = items().find((i) => i.id === id);
    if (!node.parent_id) {
      showWarning("Already at the top level.");
      return;
    }
    move(id, node.parent_id, "after");
  };

  const save = () => {
    const f = form;
    if (!f.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!f.menu_category_id) {
      setFormError("Choose a menu category.");
      return;
    }
    if (f.id && f.parent_id && (f.parent_id === f.id || isDescendant(f.parent_id, f.id))) {
      setFormError("That parent sits inside this item — pick another.");
      return;
    }
    const payload = {
      title: f.title.trim(),
      description: f.description.trim(),
      icon: f.icon.trim(),
      image: f.image.trim(),
      link: f.link.trim(),
      parent_id: f.parent_id || null,
      menu_category_id: f.menu_category_id,
      order: Math.max(1, parseInt(f.order, 10) || 1),
    };
    saveMutation.mutate(
      { id: f.id, payload },
      {
        onSuccess: () => {
          setFormOpen(false);
          setForm({ ...BLANK });
          setFormError(null);
          if (payload.parent_id) setCollapsed((prev) => ({ ...prev, [payload.parent_id]: false }));
          showSuccess(
            f.id ? `Saved "${payload.title}".` : `Added "${payload.title}"${payload.parent_id ? " as a submenu item." : " to the top level."}`
          );
        },
        onError: (error) => {
          const message = errorMessage(error, "Couldn't save that menu item.");
          setFormError(message);
        },
      }
    );
  };

  // ---- derived view ----
  const catName = (id) => categories.find((c) => c.id === id)?.name || "";

  const q = search.trim().toLowerCase();
  const visible = (i) => (showDeleted || !i.deleted_at) && (!q || `${i.title} ${i.link || ""}`.toLowerCase().includes(q));

  const scoped = items();
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
              link: i.link || "",
              parent_id: i.parent_id || "",
              menu_category_id: i.menu_category_id,
              order: i.order,
            });
          },
          onTrash: () => {
            if (i.deleted_at) {
              restoreMutation.mutate(i.id, {
                onSuccess: () => showSuccess(`Restored "${i.title}".`),
                onError: (error) => showError(errorMessage(error, "Couldn't restore that item.")),
              });
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

  const pending = scoped.find((i) => i.id === trashId) || null;
  const pendingKids = pending ? scoped.filter((i) => i.parent_id === pending.id && !i.deleted_at).length : 0;

  const f = form;
  const parentPool = scoped.filter(
    (i) => i.menu_category_id === (f.menu_category_id || cat) && !i.deleted_at && i.id !== f.id && !isDescendant(i.id, f.id)
  );

  const loading = categoriesQuery.isLoading || (!!cat && menusQuery.isLoading);

  return {
    countLine: cat ? `${activeScoped.length} items in ${catName(cat)}` : "Loading…",
    categoryCards: categories.map((c) => ({
      key: c.id,
      name: c.name,
      hint: c.slug,
      countLabel: `${counts[c.id] ?? "…"} items`,
      border: cat === c.id ? "var(--orange-500)" : "var(--border)",
      bg: cat === c.id ? "var(--surface-card)" : "var(--surface-sunken)",
      onSelect: () => {
        setCat(c.id);
        setSearch("");
      },
    })),

    rows,
    noRows: rows.length === 0,
    emptyMessage: loading
      ? "Loading menu items…"
      : q
        ? `Nothing in ${catName(cat)} matches "${search}".`
        : `${catName(cat)} has no items yet — add the first one.`,

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

    // Every drag, nudge, indent and outdent writes straight through to the
    // API and refetches — there is no local "dirty" staging to save or
    // revert.
    dirty: false,
    saveOrder: () => {},
    revertOrder: () => {},

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
    formSaving: saveMutation.isPending,
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
    categoryOptions: categories.map((c) => ({ value: c.id, label: c.name })),
    parentOptions: [{ value: "", label: "No parent — top level" }].concat(
      parentPool.map((i) => ({ value: i.id, label: (i.parent_id ? "— " : "") + i.title }))
    ),
    setFormField: (key, value) => {
      if (key === "menu_category_id") {
        setForm((prev) => ({ ...prev, menu_category_id: value, parent_id: "" }));
        return;
      }
      setForm((prev) => ({ ...prev, [key]: value }));
      if (key === "title" || key === "parent_id" || key === "menu_category_id") setFormError(null);
    },
    hasImage: !!f.image,
    imagePreviewCss: f.image ? `url("${String(f.image).replace(/"/g, "%22")}")` : "none",
    imagePlaceholderLabel: f.image ? "" : "No image",
    clearImage: () => setForm((prev) => ({ ...prev, image: "" })),

    submitLabel: f.id ? "Save item" : "Add item",
    submitForm: save,

    trashOpen: !!pending,
    trashMessage: pending
      ? pendingKids
        ? `"${pending.title}" still has ${pendingKids} submenu item${pendingKids === 1 ? "" : "s"}. Move or delete ${pendingKids === 1 ? "it" : "them"} first, then trash this item.`
        : `"${pending.title}" gets moved to trash. You can restore it later from "Show trashed".`
      : "",
    cancelTrash: () => setTrashId(null),
    confirmTrash: () => {
      const id = trashId;
      const target = scoped.find((i) => i.id === id);
      const kidsCount = target ? scoped.filter((i) => i.parent_id === target.id && !i.deleted_at).length : 0;
      if (kidsCount) {
        showWarning("Move or delete the submenu items first.");
        setTrashId(null);
        return;
      }
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setTrashId(null);
          showSuccess(`Moved "${target?.title || "item"}" to trash.`);
        },
        onError: (error) => {
          setTrashId(null);
          showError(errorMessage(error, "Couldn't move that item to trash."));
        },
      });
    },
  };
}
