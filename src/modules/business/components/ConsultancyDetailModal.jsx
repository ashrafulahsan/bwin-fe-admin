"use client";

import { Button } from "@/components/ui";
import { plainText } from "@/utils/plainText";
import { CONSULTANCY_CATEGORIES, nameById } from "../constants/consultancies.mock";

const BODY_FONT = "var(--font-body)";
const MONO_FONT = "var(--font-mono)";

function buildGroups(c) {
  return [
    {
      title: "Service",
      fields: [
        { label: "consultancy_code", value: c.consultancy_code, font: MONO_FONT },
        { label: "title", value: c.title, font: BODY_FONT },
        { label: "slug", value: c.slug, font: MONO_FONT },
        { label: "consultancy_type", value: c.consultancy_type, font: BODY_FONT },
        { label: "category_id", value: nameById(CONSULTANCY_CATEGORIES, c.category_id), font: BODY_FONT },
        { label: "sort_order", value: String(c.sort_order), font: MONO_FONT },
        { label: "description", value: plainText(c.description) || "—", font: BODY_FONT, wide: true },
      ],
    },
    {
      title: "Media & status",
      fields: [
        { label: "thumbnail", value: c.thumbnail || "—", font: MONO_FONT },
        { label: "promo_video_url", value: c.promo_video_url || "—", font: MONO_FONT },
        { label: "status", value: c.status, font: BODY_FONT },
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

export default function ConsultancyDetailModal({ consultancy, onClose, onEdit }) {
  if (!consultancy) return null;
  const groups = buildGroups(consultancy);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 760, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>{consultancy.title}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", overflowWrap: "anywhere" }}>{consultancy.id}</div>
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
            Edit consultancy
          </Button>
        </div>
      </div>
    </div>
  );
}
