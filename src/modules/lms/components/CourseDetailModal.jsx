"use client";

import { Button } from "@/components/ui";
import { plainText } from "@/utils/plainText";
import { COURSE_CATEGORIES, COURSE_TYPES, DELIVERY_MODES, nameById, money } from "../constants/courses.mock";

const BODY_FONT = "var(--font-body)";
const MONO_FONT = "var(--font-mono)";
const list = (v) => (v && v.length ? v.join(" · ") : "—");

function buildGroups(c) {
  return [
    {
      title: "Identity",
      fields: [
        { label: "course_code", value: c.course_code, font: MONO_FONT },
        { label: "title", value: c.title, font: BODY_FONT },
        { label: "slug", value: c.slug, font: MONO_FONT },
        { label: "short_description", value: c.short_description || "—", font: BODY_FONT, wide: true },
        { label: "description", value: plainText(c.description) || "—", font: BODY_FONT, wide: true },
      ],
    },
    {
      title: "Classification",
      fields: [
        { label: "category_id", value: nameById(COURSE_CATEGORIES, c.category_id), font: BODY_FONT },
        { label: "course_type", value: nameById(COURSE_TYPES, c.course_type), font: BODY_FONT },
        { label: "delivery_mode", value: nameById(DELIVERY_MODES, c.delivery_mode), font: BODY_FONT },
        { label: "level", value: c.level, font: BODY_FONT },
        { label: "language", value: c.language, font: BODY_FONT },
        { label: "sort_order", value: String(c.sort_order), font: MONO_FONT },
      ],
    },
    {
      title: "Curriculum",
      fields: [
        { label: "learning_outcomes", value: list(c.learning_outcomes), font: BODY_FONT, wide: true },
        { label: "requirements", value: list(c.requirements), font: BODY_FONT, wide: true },
        { label: "target_audience", value: list(c.target_audience), font: BODY_FONT, wide: true },
        { label: "duration", value: `${c.duration_hours}h ${c.duration_minutes}m`, font: MONO_FONT },
        { label: "total_modules", value: String(c.total_modules), font: MONO_FONT },
        { label: "total_lessons", value: String(c.total_lessons), font: MONO_FONT },
        { label: "total_quizzes", value: String(c.total_quizzes), font: MONO_FONT },
        { label: "total_assignments", value: String(c.total_assignments), font: MONO_FONT },
        { label: "total_resources", value: String(c.total_resources), font: MONO_FONT },
      ],
    },
    {
      title: "Assessment & certificate",
      fields: [
        { label: "passing_score", value: `${c.passing_score}%`, font: MONO_FONT },
        { label: "max_attempts", value: c.max_attempts == null ? "unlimited" : String(c.max_attempts), font: MONO_FONT },
        { label: "certificate_enabled", value: String(c.certificate_enabled), font: MONO_FONT },
        { label: "certificate_template_id", value: c.certificate_template_id || "—", font: MONO_FONT },
      ],
    },
    {
      title: "Pricing & enrollment",
      fields: [
        { label: "price", value: money(c.price, c.currency), font: MONO_FONT },
        { label: "discount_price", value: c.discount_price == null ? "—" : money(c.discount_price, c.currency), font: MONO_FONT },
        { label: "currency", value: c.currency, font: MONO_FONT },
        { label: "seat_limit", value: c.seat_limit == null ? "unlimited" : String(c.seat_limit), font: MONO_FONT },
        { label: "enrollment_start_date", value: c.enrollment_start_date || "—", font: MONO_FONT },
        { label: "enrollment_end_date", value: c.enrollment_end_date || "—", font: MONO_FONT },
        { label: "course_start_date", value: c.course_start_date || "—", font: MONO_FONT },
        { label: "course_end_date", value: c.course_end_date || "—", font: MONO_FONT },
      ],
    },
    {
      title: "Media",
      fields: [
        { label: "thumbnail", value: c.thumbnail || "—", font: MONO_FONT },
        { label: "cover_image", value: c.cover_image || "—", font: MONO_FONT },
        { label: "promo_video_url", value: c.promo_video_url || "—", font: MONO_FONT },
        { label: "intro_video_url", value: c.intro_video_url || "—", font: MONO_FONT },
      ],
    },
    {
      title: "Publishing",
      fields: [
        { label: "status", value: c.status, font: BODY_FONT },
        { label: "visibility", value: c.visibility, font: BODY_FONT },
        { label: "featured", value: String(c.featured), font: MONO_FONT },
        { label: "allow_reviews", value: String(c.allow_reviews), font: MONO_FONT },
        { label: "allow_discussion", value: String(c.allow_discussion), font: MONO_FONT },
        { label: "published_at", value: c.published_at || "not published", font: MONO_FONT },
        { label: "created_by", value: c.created_by || "—", font: BODY_FONT },
        { label: "updated_by", value: c.updated_by || "—", font: BODY_FONT },
        { label: "created_at", value: c.created_at, font: MONO_FONT },
        { label: "updated_at", value: c.updated_at, font: MONO_FONT },
        { label: "deleted_at", value: c.deleted_at || "—", font: MONO_FONT },
      ],
    },
    {
      title: "SEO",
      fields: [
        { label: "meta_title", value: c.meta_title || "—", font: BODY_FONT, wide: true },
        { label: "meta_description", value: c.meta_description || "—", font: BODY_FONT, wide: true },
        { label: "meta_keywords", value: c.meta_keywords || "—", font: MONO_FONT },
        { label: "meta_robots", value: c.meta_robots, font: MONO_FONT },
        { label: "canonical_url", value: c.canonical_url || "—", font: MONO_FONT, wide: true },
        { label: "og_title", value: c.og_title || "—", font: BODY_FONT },
        { label: "og_description", value: c.og_description || "—", font: BODY_FONT },
        { label: "og_image_url", value: c.og_image_url || "—", font: MONO_FONT },
      ],
    },
  ];
}

export default function CourseDetailModal({ course, onClose, onEdit }) {
  if (!course) return null;
  const groups = buildGroups(course);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 840, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>{course.title}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", overflowWrap: "anywhere" }}>{course.id}</div>
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, flex: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-muted)", fontSize: 16, lineHeight: 1, cursor: "pointer" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface-sunken)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "18px 24px 4px", display: "flex", flexDirection: "column", gap: 18 }}>
          {groups.map((g) => (
            <div key={g.title}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 10 }}>
                {g.title}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px 20px" }}>
                {g.fields.map((f) => (
                  <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, gridColumn: f.wide ? "1 / -1" : "auto" }}>
                    <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{f.label}</span>
                    <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: f.font, overflowWrap: "anywhere" }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 24px 20px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="accent" onClick={onEdit}>
            Edit course
          </Button>
        </div>
      </div>
    </div>
  );
}
