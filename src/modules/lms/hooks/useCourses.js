"use client";

import { useMemo, useState } from "react";
import {
  COURSES,
  COURSE_CATEGORIES,
  COURSE_TYPES,
  DELIVERY_MODES,
  COURSE_LEVELS,
  COURSE_STATUSES,
  COURSE_VISIBILITIES,
  COURSE_LANGUAGES,
  nameById,
} from "../constants/courses.mock";
import { EMPTY_COURSE_FORM } from "../constants/courseFormFields";
import { validateCourseForm } from "../validation/validateCourseForm";

const capitalize = (v) => String(v || "").charAt(0).toUpperCase() + String(v || "").slice(1);
const nowStamp = () => new Date().toISOString().slice(0, 19).replace("T", " ") + "+06";

// courses row -> flat string form state, for editing.
function toForm(c) {
  const dt = (v) => (v ? String(v).slice(0, 16).replace(" ", "T") : "");
  const lines = (v) => (v || []).join("\n");
  const num = (v) => (v == null ? "" : String(v));
  return {
    ...EMPTY_COURSE_FORM,
    course_code: c.course_code || "",
    title: c.title || "",
    slug: c.slug || "",
    short_description: c.short_description || "",
    description: c.description || "",
    learning_outcomes: lines(c.learning_outcomes),
    requirements: lines(c.requirements),
    target_audience: lines(c.target_audience),
    category_id: c.category_id || "",
    level: c.level,
    language: c.language,
    course_type: c.course_type || "",
    delivery_mode: c.delivery_mode || "",
    thumbnail: c.thumbnail || "",
    cover_image: c.cover_image || "",
    promo_video_url: c.promo_video_url || "",
    intro_video_url: c.intro_video_url || "",
    duration_hours: num(c.duration_hours),
    duration_minutes: num(c.duration_minutes),
    total_modules: num(c.total_modules),
    total_lessons: num(c.total_lessons),
    total_quizzes: num(c.total_quizzes),
    total_assignments: num(c.total_assignments),
    total_resources: num(c.total_resources),
    passing_score: num(c.passing_score),
    certificate_enabled: !!c.certificate_enabled,
    certificate_template_id: c.certificate_template_id || "",
    max_attempts: num(c.max_attempts),
    seat_limit: num(c.seat_limit),
    price: num(c.price),
    discount_price: num(c.discount_price),
    currency: c.currency || "USD",
    enrollment_start_date: dt(c.enrollment_start_date),
    enrollment_end_date: dt(c.enrollment_end_date),
    course_start_date: dt(c.course_start_date),
    course_end_date: dt(c.course_end_date),
    status: c.status,
    visibility: c.visibility,
    featured: !!c.featured,
    allow_reviews: !!c.allow_reviews,
    allow_discussion: !!c.allow_discussion,
    sort_order: num(c.sort_order),
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

// flat form state -> courses row shape.
function fromForm(f) {
  const ts = (v) => (v ? v.replace("T", " ") + ":00+06" : null);
  const arr = (v) => v.split("\n").map((x) => x.trim()).filter(Boolean);
  const int = (v) => (v === "" || v == null ? null : parseInt(v, 10) || 0);
  const dec = (v) => (v === "" || v == null ? null : Number(v));
  return {
    course_code: f.course_code.trim(),
    title: f.title.trim(),
    slug: f.slug.trim(),
    short_description: f.short_description.trim() || null,
    description: f.description.trim(),
    learning_outcomes: arr(f.learning_outcomes),
    requirements: arr(f.requirements),
    target_audience: arr(f.target_audience),
    category_id: f.category_id || null,
    level: f.level,
    language: f.language,
    course_type: f.course_type || null,
    delivery_mode: f.delivery_mode || null,
    thumbnail: f.thumbnail.trim() || null,
    cover_image: f.cover_image.trim() || null,
    promo_video_url: f.promo_video_url.trim() || null,
    intro_video_url: f.intro_video_url.trim() || null,
    duration_hours: int(f.duration_hours) || 0,
    duration_minutes: int(f.duration_minutes) || 0,
    total_modules: int(f.total_modules) || 0,
    total_lessons: int(f.total_lessons) || 0,
    total_quizzes: int(f.total_quizzes) || 0,
    total_assignments: int(f.total_assignments) || 0,
    total_resources: int(f.total_resources) || 0,
    passing_score: int(f.passing_score) || 0,
    certificate_enabled: !!f.certificate_enabled,
    certificate_template_id: f.certificate_template_id || null,
    max_attempts: int(f.max_attempts),
    seat_limit: int(f.seat_limit),
    price: dec(f.price) || 0,
    discount_price: dec(f.discount_price),
    currency: f.currency,
    enrollment_start_date: ts(f.enrollment_start_date),
    enrollment_end_date: ts(f.enrollment_end_date),
    course_start_date: ts(f.course_start_date),
    course_end_date: ts(f.course_end_date),
    status: f.status,
    visibility: f.visibility,
    featured: !!f.featured,
    allow_reviews: !!f.allow_reviews,
    allow_discussion: !!f.allow_discussion,
    sort_order: int(f.sort_order) || 0,
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

export function useCourses() {
  const [courses, setCourses] = useState(COURSES);
  const [view, setView] = useState("list"); // "list" | "form"
  const [editId, setEditId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [notice, setNotice] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [visibility, setVisibility] = useState("all");
  const [type, setType] = useState("all");
  const [mode, setMode] = useState("all");
  const [price, setPrice] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [showDeleted, setShowDeleted] = useState(false);

  const [form, setForm] = useState(EMPTY_COURSE_FORM);
  const [formError, setFormError] = useState(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const patch = (id, changes, noticeText) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));
    setNotice(noticeText || null);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses
      .filter((c) => {
        if (showDeleted ? !c.deleted_at : !!c.deleted_at) return false;
        if (category !== "all" && c.category_id !== category) return false;
        if (level !== "all" && c.level !== level) return false;
        if (status !== "all" && c.status !== status) return false;
        if (visibility !== "all" && c.visibility !== visibility) return false;
        if (type !== "all" && c.course_type !== type) return false;
        if (mode !== "all" && c.delivery_mode !== mode) return false;
        if (price === "free" && Number(c.price) > 0) return false;
        if (price === "paid" && Number(c.price) === 0) return false;
        if (price === "discounted" && c.discount_price == null) return false;
        if (featured === "yes" && !c.featured) return false;
        if (featured === "no" && c.featured) return false;
        if (q) {
          const hay = `${c.title} ${c.course_code} ${c.slug} ${c.short_description || ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [courses, search, category, level, status, visibility, type, mode, price, featured, showDeleted]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setLevel("all");
    setStatus("all");
    setVisibility("all");
    setType("all");
    setMode("all");
    setPrice("all");
    setFeatured("all");
  };

  const live = useMemo(() => courses.filter((c) => !c.deleted_at), [courses]);
  const stats = [
    { label: "Total courses", value: String(live.length) },
    { label: "Published", value: String(live.filter((c) => c.status === "published").length) },
    { label: "Draft / review", value: String(live.filter((c) => c.status === "draft" || c.status === "review").length) },
    { label: "Featured", value: String(live.filter((c) => c.featured).length) },
    { label: "Enrolled learners", value: live.reduce((n, c) => n + (c.enrolled || 0), 0).toLocaleString("en-US") },
  ];

  const idOpts = (list, allLabel) => [{ value: "all", label: allLabel }].concat(list.map((x) => ({ value: x.id, label: x.name })));
  const valOpts = (list, allLabel) => [{ value: "all", label: allLabel }].concat(list.map((v) => ({ value: v, label: capitalize(v) })));

  const filterSelects = [
    { key: "category", label: "Category", value: category, onChange: (e) => setCategory(e.target.value), options: idOpts(COURSE_CATEGORIES, "All categories") },
    { key: "status", label: "Status", value: status, onChange: (e) => setStatus(e.target.value), options: valOpts(COURSE_STATUSES, "All statuses") },
    { key: "level", label: "Level", value: level, onChange: (e) => setLevel(e.target.value), options: valOpts(COURSE_LEVELS, "All levels") },
    { key: "visibility", label: "Visibility", value: visibility, onChange: (e) => setVisibility(e.target.value), options: valOpts(COURSE_VISIBILITIES, "Any visibility") },
    { key: "type", label: "Course type", value: type, onChange: (e) => setType(e.target.value), options: idOpts(COURSE_TYPES, "All types") },
    { key: "mode", label: "Delivery mode", value: mode, onChange: (e) => setMode(e.target.value), options: idOpts(DELIVERY_MODES, "All modes") },
    {
      key: "price",
      label: "Price",
      value: price,
      onChange: (e) => setPrice(e.target.value),
      options: [
        { value: "all", label: "Any price" },
        { value: "free", label: "Free" },
        { value: "paid", label: "Paid" },
        { value: "discounted", label: "On discount" },
      ],
    },
    {
      key: "featured",
      label: "Featured",
      value: featured,
      onChange: (e) => setFeatured(e.target.value),
      options: [
        { value: "all", label: "Any" },
        { value: "yes", label: "Featured only" },
        { value: "no", label: "Not featured" },
      ],
    },
  ];

  const openNew = () => {
    setView("form");
    setEditId(null);
    setForm(EMPTY_COURSE_FORM);
    setFormError(null);
    setAdvancedOpen(false);
    setNotice(null);
  };
  const openEdit = (course) => {
    setView("form");
    setEditId(course.id);
    setForm(toForm(course));
    setFormError(null);
    setDetailId(null);
    setAdvancedOpen(false);
  };
  const cancelForm = () => {
    setView("list");
    setEditId(null);
    setForm(EMPTY_COURSE_FORM);
    setFormError(null);
    setAdvancedOpen(false);
  };

  const setFormField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFormError(null);
  };

  const submit = (publish) => {
    const err = validateCourseForm(form, courses, editId);
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
      setForm(EMPTY_COURSE_FORM);
      setAdvancedOpen(false);
      return;
    }

    const id = `new-${courses.length + 1}`;
    setCourses((prev) => prev.concat({ ...rec, id, created_at: now, created_by: "Amara Okafor", deleted_at: null, enrolled: 0 }));
    setView("list");
    setFormError(null);
    setForm(EMPTY_COURSE_FORM);
    setAdvancedOpen(false);
    setNotice(`${rec.title} created as ${nextStatus}.`);
  };

  const duplicate = (course) => {
    const id = `new-${courses.length + 1}`;
    const now = nowStamp();
    const n = courses.filter((c) => String(c.id).startsWith("new-")).length + 1;
    setCourses((prev) =>
      prev.concat({
        ...course,
        id,
        title: `${course.title} (copy)`,
        course_code: `${course.course_code}-C${n}`,
        slug: `${course.slug}-copy-${n}`,
        status: "draft",
        featured: false,
        published_at: null,
        enrolled: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      })
    );
    setNotice(`${course.title} duplicated as a draft.`);
  };

  const toggleFeature = (course) => patch(course.id, { featured: !course.featured }, `${course.title} ${course.featured ? "removed from" : "marked as"} featured.`);

  const togglePublish = (course) => {
    const published = course.status === "published";
    patch(
      course.id,
      published ? { status: "draft" } : { status: "published", published_at: nowStamp() },
      `${course.title} ${published ? "moved back to draft" : "published"}.`
    );
  };

  const toggleDelete = (course) =>
    patch(course.id, { deleted_at: course.deleted_at ? null : nowStamp() }, `${course.title} ${course.deleted_at ? "restored" : "deleted — recoverable from “Showing deleted”"}.`);

  const exportCsv = () => {
    const cols = ["course_code", "title", "slug", "level", "language", "status", "visibility", "featured", "price", "discount_price", "currency", "total_lessons", "enrolled", "published_at", "updated_at"];
    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = [cols.join(",")].concat(filtered.map((r) => cols.map((k) => esc(r[k])).join(","))).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "bwin-courses.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setNotice(`Exported ${filtered.length} courses to bwin-courses.csv.`);
  };

  const editing = editId ? courses.find((c) => c.id === editId) : null;
  const current = detailId ? courses.find((c) => c.id === detailId) : null;

  return {
    // list
    filtered,
    totalCount: courses.length,
    noResults: filtered.length === 0,
    stats,
    resultCount: `${filtered.length} of ${courses.length} courses`,
    notice,
    dismissNotice: () => setNotice(null),
    exportCsv,

    // filters
    search,
    setSearch,
    filterSelects,
    resetFilters,
    showDeleted,
    toggleShowDeleted: () => setShowDeleted((v) => !v),

    // row actions
    onView: setDetailId,
    onEdit: openEdit,
    onDuplicate: duplicate,
    onFeature: toggleFeature,
    onPublish: togglePublish,
    onDelete: toggleDelete,

    // detail modal
    current,
    closeDetail: () => setDetailId(null),
    editFromDetail: () => {
      if (current) openEdit(current);
    },

    // view / form
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
