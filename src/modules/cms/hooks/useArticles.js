"use client";

import { useRef, useState } from "react";
import { slugify } from "@/utils/slugify";
import { useToast } from "@/hooks/useToast";
import { BLOGS, BLOG_CATEGORIES, AUTHORS } from "../constants/blogs.mock";

const BLANK = {
  id: null,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image_url: "",
  featured_image_alt: "",
  blog_category_id: "",
  status: "draft",
  published_at: "",
  is_featured: false,
  reading_minutes: 1,
  author_id: "",
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
const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function useArticles() {
  const [posts, setPosts] = useState(BLOGS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formTab, setFormTab] = useState("content");
  const [form, setFormState] = useState({ ...BLANK });
  const [slugTouched, setSlugTouched] = useState(false);
  const [featuredDrag, setFeaturedDrag] = useState(false);
  const [ogDrag, setOgDrag] = useState(false);
  const [formError, setFormError] = useState(null);
  const { showSuccess } = useToast();
  const seqRef = useRef(0);
  const featuredFileRef = useRef(null);
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
      setFormState((prev) => (kind === "og" ? { ...prev, og_image_url: reader.result, og_image_name: file.name } : { ...prev, featured_image_url: reader.result, featured_image_name: file.name }));
      setFormError(null);
      setFeaturedDrag(false);
      setOgDrag(false);
    };
    reader.readAsDataURL(file);
  };

  const openEdit = (p) => {
    setFormOpen(true);
    setFormTab("content");
    setSlugTouched(true);
    setFormError(null);
    setFormState({ ...BLANK, ...p, published_at: toInput(p.published_at), author_id: p.author_id || "" });
  };

  const commit = (statusOverride) => {
    const f = form;
    if (!f.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!f.blog_category_id) {
      setFormError("Pick a category.");
      return;
    }
    if (!f.content.trim()) {
      setFormError("Content is required — a post cannot be empty.");
      return;
    }
    const slug = f.slug.trim() || slugify(f.title);
    if (posts.some((p) => p.slug === slug && p.id !== f.id)) {
      setFormError("That slug is already used by another post.");
      return;
    }
    const status = statusOverride || f.status;
    let published = toStore(f.published_at);
    if (status === "published" && !published) published = nowStamp();
    if (status === "scheduled" && !published) {
      setFormError("A scheduled post needs a publish date.");
      return;
    }

    const patch = {
      title: f.title.trim(),
      slug,
      excerpt: f.excerpt.trim(),
      content: f.content,
      featured_image_url: f.featured_image_url.trim(),
      featured_image_alt: f.featured_image_alt.trim(),
      blog_category_id: f.blog_category_id,
      status,
      published_at: published,
      is_featured: !!f.is_featured,
      reading_minutes: Math.max(1, parseInt(f.reading_minutes, 10) || 1),
      author_id: f.author_id || null,
      meta_title: f.meta_title.trim(),
      meta_description: f.meta_description.trim(),
      meta_keywords: f.meta_keywords.trim(),
      canonical_url: f.canonical_url.trim(),
      og_title: f.og_title.trim(),
      og_description: f.og_description.trim(),
      og_image_url: f.og_image_url.trim(),
      meta_robots: f.meta_robots,
      updated_by: "You",
      updated_at: nowStamp(),
    };
    if (f.id) {
      setPosts((prev) => prev.map((p) => (p.id === f.id ? { ...p, ...patch } : p)));
      setFormOpen(false);
      setFormError(null);
      showSuccess(`Saved "${patch.title}".`);
      return;
    }
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    setPosts((prev) => prev.concat([{ id: `b-new-${seq}`, ...patch, created_by: "You", created_at: nowStamp(), deleted_at: null }]));
    setFormOpen(false);
    setFormError(null);
    showSuccess(status === "published" ? `Published "${patch.title}".` : `Created "${patch.title}" as ${status}.`);
  };

  const setStatus = (id, status) => {
    const p = posts.find((x) => x.id === id);
    const published_at = status === "published" && !p.published_at ? nowStamp() : p.published_at;
    setPosts((prev) => prev.map((x) => (x.id === id ? { ...x, status, published_at, updated_by: "You", updated_at: nowStamp() } : x)));
    showSuccess(`"${p.title}" is now ${status}.`);
  };

  const toggleFeature = (id) => {
    const p = posts.find((x) => x.id === id);
    setPosts((prev) => prev.map((x) => (x.id === id ? { ...x, is_featured: !x.is_featured } : x)));
    showSuccess(p.is_featured ? `Removed "${p.title}" from featured.` : `"${p.title}" is now featured.`);
  };

  const duplicate = (p) => {
    const seq = seqRef.current + 1;
    seqRef.current = seq;
    const stamp = nowStamp();
    const copy = { ...p, id: `b-new-${seq}`, title: `${p.title} (copy)`, slug: `${p.slug}-copy-${seq}`, status: "draft", published_at: null, is_featured: false, created_by: "You", created_at: stamp, updated_by: "You", updated_at: stamp, deleted_at: null };
    setPosts((prev) => prev.concat([copy]));
    showSuccess("Duplicated as a draft.");
  };

  const trash = (id) => {
    const p = posts.find((x) => x.id === id);
    const at = p.deleted_at ? null : nowStamp();
    setPosts((prev) => prev.map((x) => (x.id === id ? { ...x, deleted_at: at } : x)));
    showSuccess(at ? `"${p.title}" moved to trash.` : `"${p.title}" restored.`);
  };

  // ---- derived view ----
  const q = search.trim().toLowerCase();
  const catName = (id) => (BLOG_CATEGORIES.find((c) => c.id === id) || {}).name || "—";
  const authorName = (id) => (AUTHORS.find((a) => a.id === id) || {}).name || "Unassigned";

  const live = posts.filter((p) => !p.deleted_at);
  const filtered = posts
    .filter((p) => showDeleted || !p.deleted_at)
    .filter((p) => categoryFilter === "all" || p.blog_category_id === categoryFilter)
    .filter((p) => statusFilter === "all" || p.status === statusFilter)
    .filter((p) => authorFilter === "all" || (p.author_id || "") === authorFilter)
    .filter((p) => !featuredOnly || p.is_featured)
    .filter((p) => !q || `${p.title} ${p.slug} ${p.excerpt || ""} ${p.meta_keywords || ""}`.toLowerCase().includes(q));

  const sorted = filtered.slice().sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "updated") return (b.updated_at || "").localeCompare(a.updated_at || "");
    const av = a.published_at || a.created_at;
    const bv = b.published_at || b.created_at;
    return sort === "oldest" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const rows = sorted.map((p) => {
    const seoGaps = [];
    if (!(p.meta_title || "").trim()) seoGaps.push("meta title");
    if (!(p.meta_description || "").trim() && !(p.excerpt || "").trim()) seoGaps.push("meta description");
    if (p.featured_image_url && !(p.featured_image_alt || "").trim()) seoGaps.push("image alt");
    const canPublish = p.status !== "published";
    const tags = (p.meta_keywords || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((t) => ({ label: t }));
    const isDataUrl = /^data:/.test(p.featured_image_url || "");
    return {
      id: p.id,
      categoryName: catName(p.blog_category_id),
      tags,
      noTags: tags.length === 0,
      thumbCss: isDataUrl ? `url("${p.featured_image_url}")` : "none",
      thumbLabel: isDataUrl ? "" : p.featured_image_url || "no image",
      title: p.title,
      slugDisplay: `/insights/${p.slug}`,
      excerpt: p.excerpt || "No excerpt yet.",
      status: p.status,
      tone: TONE[p.status] || "neutral",
      isFeatured: p.is_featured,
      isDeleted: !!p.deleted_at,
      opacity: p.deleted_at ? 0.55 : 1,
      metaTail:
        ` · ${catName(p.blog_category_id)} · ${authorName(p.author_id)} · ${p.reading_minutes} min · ` +
        (p.published_at ? `${p.status === "scheduled" ? "goes live " : "published "}${p.published_at}` : "unpublished") +
        ` · updated ${p.updated_at}`,
      seoWeak: seoGaps.length > 0,
      seoLabel: `SEO: no ${seoGaps.join(", ")}`,
      primaryLabel: canPublish ? "Publish" : "Unpublish",
      primaryIcon: canPublish ? "eye" : "eye-slash",
      onPrimary: () => setStatus(p.id, canPublish ? "published" : "draft"),
      featureLabel: p.is_featured ? "Unfeature" : "Feature",
      onFeature: () => toggleFeature(p.id),
      onEdit: () => openEdit(p),
      onDuplicate: () => duplicate(p),
      onTrash: () => trash(p.id),
      trashLabel: p.deleted_at ? "Restore" : "Trash",
    };
  });

  const f = form;
  const words = f.content.trim() ? f.content.trim().split(/\s+/).length : 0;
  const metaTitleLen = (f.meta_title || "").length;
  const metaDescLen = (f.meta_description || "").length;
  const filtersDirty = !!(q || categoryFilter !== "all" || statusFilter !== "all" || authorFilter !== "all" || featuredOnly || showDeleted || sort !== "newest");

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
    countLine: `${live.length} posts · ${live.filter((p) => p.status === "published").length} live`,

    statCards: [
      statFor("All posts", live.length, { statusFilter: "all", featuredOnly: false, showDeleted: false }, statusFilter === "all" && !featuredOnly),
      statFor("Published", live.filter((p) => p.status === "published").length, { statusFilter: "published", featuredOnly: false }, statusFilter === "published"),
      statFor("Drafts", live.filter((p) => p.status === "draft").length, { statusFilter: "draft", featuredOnly: false }, statusFilter === "draft"),
      statFor("Scheduled", live.filter((p) => p.status === "scheduled").length, { statusFilter: "scheduled", featuredOnly: false }, statusFilter === "scheduled"),
      statFor("Featured", live.filter((p) => p.is_featured).length, { featuredOnly: true, statusFilter: "all" }, featuredOnly),
    ],

    rows,
    noRows: rows.length === 0,
    emptyMessage: filtersDirty ? "Nothing matches those filters." : "No posts yet — write the first one.",

    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categoryFilterOptions: [{ value: "all", label: "All categories" }].concat(BLOG_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))),
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
    authorFilterOptions: [{ value: "all", label: "All authors" }].concat(AUTHORS.map((a) => ({ value: a.id, label: a.name }))),
    sort,
    setSort,
    sortOptions: [
      { value: "newest", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
      { value: "updated", label: "Recently edited" },
      { value: "title", label: "Title A–Z" },
    ],
    featuredOnly,
    toggleFeatured: () => setFeaturedOnly((v) => !v),
    showDeleted,
    toggleDeleted: () => setShowDeleted((v) => !v),
    filtersDirty,
    clearFilters: () => {
      setSearch("");
      setCategoryFilter("all");
      setStatusFilter("all");
      setAuthorFilter("all");
      setFeaturedOnly(false);
      setShowDeleted(false);
      setSort("newest");
    },

    formOpen,
    form: f,
    formTitle: f.id ? "Edit post" : "New post",
    formSubtitle: f.id ? `${catName(f.blog_category_id)} · ${authorName(f.author_id)}` : "Drafts stay hidden until you publish them.",
    formMeta: f.id ? `blogs.id ${f.id}` : "slug auto-fills from the title",
    saveLabel: f.status === "published" ? "Save and publish" : f.status === "scheduled" ? "Schedule post" : "Save post",
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
    onExcerpt: (e) => setForm({ excerpt: e.target.value }),
    onContent: (e) => {
      const v = e.target.value;
      const w = v.trim() ? v.trim().split(/\s+/).length : 0;
      setForm({ content: v, reading_minutes: Math.max(1, Math.round(w / 200)) });
    },
    onImageAlt: (e) => setForm({ featured_image_alt: e.target.value }),
    onCategory: (e) => setForm({ blog_category_id: e.target.value }),
    onAuthor: (e) => setForm({ author_id: e.target.value }),
    onStatus: (e) => setForm({ status: e.target.value }),
    onPublishedAt: (e) => setForm({ published_at: e.target.value }),
    onReadingMinutes: (e) => setForm({ reading_minutes: e.target.value }),
    onFeatured: (e) => setForm({ is_featured: e.target.checked }),
    onMetaTitle: (e) => setForm({ meta_title: e.target.value }),
    onMetaDescription: (e) => setForm({ meta_description: e.target.value }),
    onMetaKeywords: (e) => setForm({ meta_keywords: e.target.value }),
    onCanonical: (e) => setForm({ canonical_url: e.target.value }),
    onOgTitle: (e) => setForm({ og_title: e.target.value }),
    onOgDescription: (e) => setForm({ og_description: e.target.value }),
    onMetaRobots: (e) => setForm({ meta_robots: e.target.value }),

    excerptCount: `${(f.excerpt || "").length}/500 characters`,
    contentStats: `${words} words · about ${f.reading_minutes} min read`,
    metaTitleCount: metaTitleLen ? `${metaTitleLen}/60 characters` : "Empty — search engines will use the post title",
    metaTitleColor: metaTitleLen > 60 ? "var(--amber-700)" : "var(--text-muted)",
    metaDescCount: metaDescLen ? `${metaDescLen}/160 characters` : "Empty — the excerpt is used instead",
    metaDescColor: metaDescLen > 160 ? "var(--amber-700)" : "var(--text-muted)",
    previewUrl: f.canonical_url || `https://bwin.example/insights/${f.slug || slugify(f.title) || "post-slug"}`,
    previewTitle: f.meta_title || f.title || "Post title",
    previewDescription: f.meta_description || f.excerpt || "Add a meta description or excerpt so search results read well.",

    categoryOptions: [{ value: "", label: "Pick a category" }].concat(BLOG_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))),
    authorOptions: [{ value: "", label: "Unassigned" }].concat(AUTHORS.map((a) => ({ value: a.id, label: `${a.name} — ${a.role}` }))),
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

    featuredFileRef,
    ogFileRef,
    hasFeaturedImage: !!(f.featured_image_url || "").trim(),
    hasOgImage: !!(f.og_image_url || "").trim(),
    featuredPreviewCss: /^data:/.test(f.featured_image_url || "") ? `url("${f.featured_image_url}")` : "none",
    ogPreviewCss: /^data:/.test(f.og_image_url || "") ? `url("${f.og_image_url}")` : "none",
    featuredPlaceholder: /^data:/.test(f.featured_image_url || "") ? "" : f.featured_image_url ? "on file" : "no image",
    ogPlaceholder: /^data:/.test(f.og_image_url || "") ? "" : f.og_image_url ? "on file" : "no image",
    featuredUploadLabel: (f.featured_image_url || "").trim() ? "Replace image" : "Upload image",
    ogUploadLabel: (f.og_image_url || "").trim() ? "Replace image" : "Upload image",
    featuredHint: f.featured_image_name || f.featured_image_url || "Drop a file here, or upload one. JPG or PNG, 1600×900 works best.",
    ogHint: f.og_image_name || f.og_image_url || "Used when the post is shared. 1200×630 works best.",
    featuredDropBorder: featuredDrag ? "var(--orange-500)" : "var(--border-strong)",
    ogDropBorder: ogDrag ? "var(--orange-500)" : "var(--border-strong)",
    featuredDropBg: featuredDrag ? "var(--surface-sunken)" : "transparent",
    ogDropBg: ogDrag ? "var(--surface-sunken)" : "transparent",
    pickFeatured: () => featuredFileRef.current && featuredFileRef.current.click(),
    pickOg: () => ogFileRef.current && ogFileRef.current.click(),
    onFeaturedFile: (e) => takeFile("featured", e.target.files && e.target.files[0]),
    onOgFile: (e) => takeFile("og", e.target.files && e.target.files[0]),
    clearFeatured: () => setForm({ featured_image_url: "", featured_image_name: "" }),
    clearOg: () => setForm({ og_image_url: "", og_image_name: "" }),
    useFeaturedForOg: () => setForm({ og_image_url: f.featured_image_url, og_image_name: f.featured_image_name || "" }),
    onFeaturedDragOver: (e) => {
      e.preventDefault();
      if (!featuredDrag) setFeaturedDrag(true);
    },
    onFeaturedDragLeave: () => setFeaturedDrag(false),
    onFeaturedDrop: (e) => {
      e.preventDefault();
      takeFile("featured", e.dataTransfer.files && e.dataTransfer.files[0]);
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

    openNew: () => {
      setFormOpen(true);
      setFormTab("content");
      setSlugTouched(false);
      setFormError(null);
      setFormState({ ...BLANK, blog_category_id: categoryFilter !== "all" ? categoryFilter : "" });
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
