"use client";

import { useRef, useState } from "react";
import { slugify } from "@/utils/slugify";
import { useToast } from "@/hooks/useToast";
import { PAGES, PAGE_AUTHORS } from "../constants/pages.mock";

const BLANK = {
  id: null,
  title: "",
  slug: "",
  description: "",
  content: "",
  thumbnail_image: "",
  thumbnail_image_alt: "",
  status: "draft",
  published_at: "",
  is_featured: false,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  meta_robots: "index, follow",
};

const TONE = { published: "success", scheduled: "brand", draft: "warning", archived: "neutral" };
const toInput = (v) => (v ? v.replace(" ", "T") : "");
const toStore = (v) => (v ? v.replace("T", " ").slice(0, 16) : null);
const isData = (v) => /^data:/.test(v || "");
const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function usePages() {
  const [pages, setPages] = useState(PAGES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sort, setSort] = useState("title");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formTab, setFormTab] = useState("content");
  const [form, setFormState] = useState({ ...BLANK });
  const [slugTouched, setSlugTouched] = useState(false);
  const [thumbDrag, setThumbDrag] = useState(false);
  const [ogDrag, setOgDrag] = useState(false);
  const [formError, setFormError] = useState(null);
  const { showSuccess } = useToast();
  const seqRef = useRef(0);
  const thumbFileRef = useRef(null);
  const ogFileRef = useRef(null);

  const setForm = (patch) => {
    setFormState((prev) => ({ ...prev, ...patch }));
    setFormError(null);
  };

  const takeFile = (kind, file) => {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setFormError("That file is not an image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormState((prev) => (kind === "og" ? { ...prev, og_image_url: reader.result, og_image_name: file.name } : { ...prev, thumbnail_image: reader.result, thumbnail_image_name: file.name }));
      setFormError(null);
      setThumbDrag(false);
      setOgDrag(false);
    };
    reader.readAsDataURL(file);
  };

  const openEdit = (p) => {
    setFormOpen(true);
    setFormTab("content");
    setSlugTouched(true);
    setFormError(null);
    setFormState({ ...BLANK, ...p, published_at: toInput(p.published_at) });
  };

  const commit = (statusOverride) => {
    const f = form;
    if (!f.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!f.content.trim()) {
      setFormError("Content is required — a page cannot be empty.");
      return;
    }
    const slug = f.slug.trim() || slugify(f.title);
    if (pages.some((p) => p.slug === slug && p.id !== f.id)) {
      setFormError("That slug is already used by another page.");
      return;
    }
    const status = statusOverride || f.status;
    let published = toStore(f.published_at);
    if (status === "published" && !published) published = nowStamp();
    if (status === "scheduled" && !published) {
      setFormError("A scheduled page needs a publish date.");
      return;
    }

    const patch = {
      title: f.title.trim(),
      slug,
      description: f.description.trim(),
      content: f.content,
      thumbnail_image: f.thumbnail_image,
      thumbnail_image_alt: f.thumbnail_image_alt.trim(),
      thumbnail_image_name: f.thumbnail_image_name,
      status,
      published_at: published,
      is_featured: !!f.is_featured,
      meta_title: f.meta_title.trim(),
      meta_description: f.meta_description.trim(),
      meta_keywords: f.meta_keywords.trim(),
      canonical_url: f.canonical_url.trim(),
      og_title: f.og_title.trim(),
      og_description: f.og_description.trim(),
      og_image_url: f.og_image_url,
      og_image_name: f.og_image_name,
      meta_robots: f.meta_robots,
      updated_by: "You",
      updated_at: nowStamp(),
    };
    if (f.id) {
      setPages((prev) => prev.map((p) => (p.id === f.id ? { ...p, ...patch } : p)));
      setFormOpen(false);
      setFormError(null);
      showSuccess(`Saved "${patch.title}".`);
      return;
    }
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    setPages((prev) => prev.concat([{ id: `pg-new-${seq}`, ...patch, created_by: "You", created_at: nowStamp(), deleted_at: null }]));
    setFormOpen(false);
    setFormError(null);
    showSuccess(status === "published" ? `Published "${patch.title}".` : `Created "${patch.title}" as ${status}.`);
  };

  const setStatus = (id, status) => {
    const p = pages.find((x) => x.id === id);
    const published_at = status === "published" && !p.published_at ? nowStamp() : p.published_at;
    setPages((prev) => prev.map((x) => (x.id === id ? { ...x, status, published_at, updated_by: "You", updated_at: nowStamp() } : x)));
    showSuccess(`"${p.title}" is now ${status}.`);
  };

  const toggleFeature = (id) => {
    const p = pages.find((x) => x.id === id);
    setPages((prev) => prev.map((x) => (x.id === id ? { ...x, is_featured: !x.is_featured } : x)));
    showSuccess(p.is_featured ? `Removed "${p.title}" from featured.` : `"${p.title}" is now featured.`);
  };

  const duplicate = (p) => {
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    const stamp = nowStamp();
    const copy = { ...p, id: `pg-new-${seq}`, title: `${p.title} (copy)`, slug: `${p.slug}-copy-${seq}`, status: "draft", published_at: null, is_featured: false, created_by: "You", created_at: stamp, updated_by: "You", updated_at: stamp, deleted_at: null };
    setPages((prev) => prev.concat([copy]));
    showSuccess("Duplicated as a draft.");
  };

  const trash = (id) => {
    const p = pages.find((x) => x.id === id);
    const at = p.deleted_at ? null : nowStamp();
    setPages((prev) => prev.map((x) => (x.id === id ? { ...x, deleted_at: at } : x)));
    showSuccess(at ? `"${p.title}" moved to trash.` : `"${p.title}" restored.`);
  };

  // ---- derived view ----
  const q = search.trim().toLowerCase();
  const authorName = (id) => (PAGE_AUTHORS.find((a) => a.id === id) || {}).name || "Unassigned";

  const live = pages.filter((p) => !p.deleted_at);
  const filtered = pages
    .filter((p) => showDeleted || !p.deleted_at)
    .filter((p) => statusFilter === "all" || p.status === statusFilter)
    .filter((p) => authorFilter === "all" || (p.updated_by || "") === authorFilter || (p.created_by || "") === authorFilter)
    .filter((p) => !featuredOnly || p.is_featured)
    .filter((p) => !q || `${p.title} ${p.slug} ${p.description || ""} ${p.meta_keywords || ""}`.toLowerCase().includes(q));

  const sorted = filtered.slice().sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "updated") return (b.updated_at || "").localeCompare(a.updated_at || "");
    const av = a.published_at || a.created_at;
    const bv = b.published_at || b.created_at;
    return sort === "oldest" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const rows = sorted.map((p) => {
    const gaps = [];
    if (!(p.meta_title || "").trim()) gaps.push("meta title");
    if (!(p.meta_description || "").trim() && !(p.description || "").trim()) gaps.push("meta description");
    if (p.thumbnail_image && !(p.thumbnail_image_alt || "").trim()) gaps.push("image alt");
    const canPublish = p.status !== "published";
    const tags = (p.meta_keywords || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((t) => ({ label: t }));
    return {
      id: p.id,
      title: p.title,
      path: `/${p.slug === "home" ? "" : p.slug}`,
      description: p.description || "No description yet.",
      tags,
      robots: p.meta_robots,
      thumbCss: isData(p.thumbnail_image) ? `url("${p.thumbnail_image}")` : "none",
      thumbLabel: isData(p.thumbnail_image) ? "" : p.thumbnail_image || "no image",
      status: p.status,
      tone: TONE[p.status] || "neutral",
      isFeatured: p.is_featured,
      isDeleted: !!p.deleted_at,
      opacity: p.deleted_at ? 0.55 : 1,
      metaTail: (p.published_at ? `${p.status === "scheduled" ? "goes live " : "published "}${p.published_at}` : "unpublished") + ` · updated ${p.updated_at} by ${authorName(p.updated_by)}`,
      seoWeak: gaps.length > 0,
      seoLabel: `SEO: no ${gaps.join(", ")}`,
      primaryLabel: canPublish ? "Publish" : "Unpublish",
      primaryIcon: canPublish ? "eye" : "eye-slash",
      featureLabel: p.is_featured ? "Unfeature" : "Feature",
      trashLabel: p.deleted_at ? "Restore" : "Trash",
      onPrimary: () => setStatus(p.id, canPublish ? "published" : "draft"),
      onFeature: () => toggleFeature(p.id),
      onEdit: () => openEdit(p),
      onDuplicate: () => duplicate(p),
      onTrash: () => trash(p.id),
    };
  });

  const f = form;
  const words = f.content.trim() ? f.content.trim().split(/\s+/).length : 0;
  const metaTitleLen = (f.meta_title || "").length;
  const metaDescLen = (f.meta_description || "").length;
  const filtersDirty = !!(q || statusFilter !== "all" || authorFilter !== "all" || featuredOnly || showDeleted || sort !== "title");

  const statFor = (label, value, filterPatch, activeWhen) => ({
    key: label,
    label,
    value,
    active: activeWhen,
    onClick: () => {
      if (filterPatch.statusFilter !== undefined) setStatusFilter(filterPatch.statusFilter);
      if (filterPatch.featuredOnly !== undefined) setFeaturedOnly(filterPatch.featuredOnly);
      if (filterPatch.showDeleted !== undefined) setShowDeleted(filterPatch.showDeleted);
    },
  });

  return {
    countLine: `${live.length} pages · ${live.filter((p) => p.status === "published").length} live`,

    statCards: [
      statFor("All pages", live.length, { statusFilter: "all", featuredOnly: false, showDeleted: false }, statusFilter === "all" && !featuredOnly),
      statFor("Published", live.filter((p) => p.status === "published").length, { statusFilter: "published", featuredOnly: false }, statusFilter === "published"),
      statFor("Drafts", live.filter((p) => p.status === "draft").length, { statusFilter: "draft", featuredOnly: false }, statusFilter === "draft"),
      statFor("Scheduled", live.filter((p) => p.status === "scheduled").length, { statusFilter: "scheduled", featuredOnly: false }, statusFilter === "scheduled"),
      statFor("Featured", live.filter((p) => p.is_featured).length, { featuredOnly: true, statusFilter: "all" }, featuredOnly),
    ],

    rows,
    noRows: rows.length === 0,
    emptyMessage: filtersDirty ? "Nothing matches those filters." : "No pages yet — create the first one.",

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusFilterOptions: [
      { value: "all", label: "All statuses" },
      { value: "published", label: "Published" },
      { value: "scheduled", label: "Scheduled" },
      { value: "draft", label: "Draft" },
      { value: "archived", label: "Archived" },
    ],
    authorFilter,
    setAuthorFilter,
    authorFilterOptions: [{ value: "all", label: "Anyone" }].concat(PAGE_AUTHORS.map((a) => ({ value: a.id, label: a.name }))),
    sort,
    setSort,
    sortOptions: [
      { value: "title", label: "Title A–Z" },
      { value: "newest", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
      { value: "updated", label: "Recently edited" },
    ],
    featuredOnly,
    toggleFeatured: () => setFeaturedOnly((v) => !v),
    showDeleted,
    toggleDeleted: () => setShowDeleted((v) => !v),
    filtersDirty,
    clearFilters: () => {
      setSearch("");
      setStatusFilter("all");
      setAuthorFilter("all");
      setFeaturedOnly(false);
      setShowDeleted(false);
      setSort("title");
    },

    formOpen,
    form: f,
    formTitle: f.id ? "Edit page" : "New page",
    formSubtitle: f.id ? `Last updated ${f.updated_at || "—"}` : "Drafts stay hidden until you publish them.",
    formMeta: f.id ? `pages.id ${f.id}` : "slug auto-fills from the title",
    saveLabel: f.status === "published" ? "Save and publish" : f.status === "scheduled" ? "Schedule page" : "Save page",
    onContentTab: formTab === "content",
    onSeoTab: formTab === "seo",
    showContentTab: () => setFormTab("content"),
    showSeoTab: () => setFormTab("seo"),
    contentTabBg: formTab === "content" ? "var(--surface-card)" : "transparent",
    contentTabColor: formTab === "content" ? "var(--text-primary)" : "var(--text-muted)",
    seoTabBg: formTab === "seo" ? "var(--surface-card)" : "transparent",
    seoTabColor: formTab === "seo" ? "var(--text-primary)" : "var(--text-muted)",

    onTitle: (e) => {
      const v = e.target.value;
      setFormState((prev) => ({ ...prev, title: v, slug: slugTouched ? prev.slug : slugify(v) }));
      setFormError(null);
    },
    onSlug: (e) => {
      setFormState((prev) => ({ ...prev, slug: e.target.value }));
      setSlugTouched(true);
      setFormError(null);
    },
    onDescription: (e) => setForm({ description: e.target.value }),
    onContent: (e) => setForm({ content: e.target.value }),
    onThumbAlt: (e) => setForm({ thumbnail_image_alt: e.target.value }),
    onStatus: (e) => setForm({ status: e.target.value }),
    onPublishedAt: (e) => setForm({ published_at: e.target.value }),
    onFeatured: (e) => setForm({ is_featured: e.target.checked }),
    onMetaTitle: (e) => setForm({ meta_title: e.target.value }),
    onMetaDescription: (e) => setForm({ meta_description: e.target.value }),
    onMetaKeywords: (e) => setForm({ meta_keywords: e.target.value }),
    onCanonical: (e) => setForm({ canonical_url: e.target.value }),
    onOgTitle: (e) => setForm({ og_title: e.target.value }),
    onOgDescription: (e) => setForm({ og_description: e.target.value }),
    onMetaRobots: (e) => setForm({ meta_robots: e.target.value }),

    urlPreview: `bwin.example/${f.slug === "home" ? "" : f.slug || slugify(f.title)}`,
    descriptionCount: `${(f.description || "").length}/500 characters`,
    contentStats: `${words} words`,
    metaTitleCount: metaTitleLen ? `${metaTitleLen}/60 characters` : "Empty — search engines will use the page title",
    metaTitleColor: metaTitleLen > 60 ? "var(--amber-700)" : "var(--text-muted)",
    metaDescCount: metaDescLen ? `${metaDescLen}/160 characters` : "Empty — the page description is used instead",
    metaDescColor: metaDescLen > 160 ? "var(--amber-700)" : "var(--text-muted)",
    previewUrl: f.canonical_url || `https://bwin.example/${f.slug === "home" ? "" : f.slug || slugify(f.title) || "page-slug"}`,
    previewTitle: f.meta_title || f.title || "Page title",
    previewDescription: f.meta_description || f.description || "Add a meta description so search results read well.",

    thumbFileRef,
    ogFileRef,
    hasThumb: !!(f.thumbnail_image || "").trim(),
    hasOgImage: !!(f.og_image_url || "").trim(),
    thumbPreviewCss: isData(f.thumbnail_image) ? `url("${f.thumbnail_image}")` : "none",
    ogPreviewCss: isData(f.og_image_url) ? `url("${f.og_image_url}")` : "none",
    thumbPlaceholder: isData(f.thumbnail_image) ? "" : f.thumbnail_image ? "on file" : "no image",
    ogPlaceholder: isData(f.og_image_url) ? "" : f.og_image_url ? "on file" : "no image",
    thumbUploadLabel: (f.thumbnail_image || "").trim() ? "Replace image" : "Upload image",
    ogUploadLabel: (f.og_image_url || "").trim() ? "Replace image" : "Upload image",
    thumbHint: f.thumbnail_image_name || f.thumbnail_image || "Drop a file here, or upload one. JPG or PNG, 1600×900 works best.",
    ogHint: f.og_image_name || f.og_image_url || "Used when the page is shared. 1200×630 works best.",
    thumbDropBorder: thumbDrag ? "var(--orange-500)" : "var(--border-strong)",
    ogDropBorder: ogDrag ? "var(--orange-500)" : "var(--border-strong)",
    thumbDropBg: thumbDrag ? "var(--surface-sunken)" : "transparent",
    ogDropBg: ogDrag ? "var(--surface-sunken)" : "transparent",
    pickThumb: () => thumbFileRef.current && thumbFileRef.current.click(),
    pickOg: () => ogFileRef.current && ogFileRef.current.click(),
    onThumbFile: (e) => takeFile("thumb", e.target.files && e.target.files[0]),
    onOgFile: (e) => takeFile("og", e.target.files && e.target.files[0]),
    clearThumb: () => setForm({ thumbnail_image: "", thumbnail_image_name: "" }),
    clearOg: () => setForm({ og_image_url: "", og_image_name: "" }),
    useThumbForOg: () => setForm({ og_image_url: f.thumbnail_image, og_image_name: f.thumbnail_image_name || "" }),
    onThumbDragOver: (e) => {
      e.preventDefault();
      if (!thumbDrag) setThumbDrag(true);
    },
    onThumbDragLeave: () => setThumbDrag(false),
    onThumbDrop: (e) => {
      e.preventDefault();
      takeFile("thumb", e.dataTransfer.files && e.dataTransfer.files[0]);
    },
    onOgDragOver: (e) => {
      e.preventDefault();
      if (!ogDrag) setOgDrag(true);
    },
    onOgDragLeave: () => setOgDrag(false),
    onOgDrop: (e) => {
      e.preventDefault();
      takeFile("og", e.dataTransfer.files && e.dataTransfer.files[0]);
    },

    statusOptions: [
      { value: "draft", label: "Draft" },
      { value: "scheduled", label: "Scheduled" },
      { value: "published", label: "Published" },
      { value: "archived", label: "Archived" },
    ],
    robotsOptions: [
      { value: "index, follow", label: "index, follow" },
      { value: "noindex, follow", label: "noindex, follow" },
      { value: "index, nofollow", label: "index, nofollow" },
      { value: "noindex, nofollow", label: "noindex, nofollow" },
    ],

    openNew: () => {
      setFormOpen(true);
      setFormTab("content");
      setSlugTouched(false);
      setFormError(null);
      setFormState({ ...BLANK });
    },
    closeForm: () => {
      setFormOpen(false);
      setFormError(null);
    },
    save: () => commit(null),
    saveDraft: () => commit("draft"),
    formError,
  };
}
