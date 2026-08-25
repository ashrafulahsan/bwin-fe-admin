"use client";

import { Button } from "@/components/ui";
import { plainText } from "@/utils/plainText";
import { AUTOMATION_CATEGORIES, nameById } from "../constants/automations.mock";

const BODY_FONT = "var(--font-body)";
const MONO_FONT = "var(--font-mono)";

function buildGroups(a) {
  return [
    {
      title: "Automation",
      fields: [
        { label: "title", value: a.title, font: BODY_FONT },
        { label: "slug", value: a.slug, font: MONO_FONT },
        { label: "category_id", value: nameById(AUTOMATION_CATEGORIES, a.category_id), font: BODY_FONT },
        { label: "status", value: a.status, font: BODY_FONT },
        { label: "description", value: plainText(a.description) || "—", font: BODY_FONT, wide: true },
        { label: "lists", value: (a.lists || []).length ? a.lists.join(" · ") : "—", font: BODY_FONT, wide: true },
      ],
    },
    {
      title: "Media & audit",
      fields: [
        { label: "image_url", value: a.image_url || "—", font: MONO_FONT },
        { label: "video_url", value: a.video_url || "—", font: MONO_FONT },
        { label: "published_at", value: a.published_at || "not published", font: MONO_FONT },
        { label: "created_by", value: a.created_by || "—", font: BODY_FONT },
        { label: "updated_by", value: a.updated_by || "—", font: BODY_FONT },
        { label: "created_at", value: a.created_at, font: MONO_FONT },
        { label: "updated_at", value: a.updated_at, font: MONO_FONT },
        { label: "deleted_at", value: a.deleted_at || "—", font: MONO_FONT },
      ],
    },
    {
      title: "SEO",
      fields: [
        { label: "meta_title", value: a.meta_title || "—", font: BODY_FONT, wide: true },
        { label: "meta_description", value: a.meta_description || "—", font: BODY_FONT, wide: true },
        { label: "meta_keywords", value: a.meta_keywords || "—", font: MONO_FONT },
        { label: "meta_robots", value: a.meta_robots, font: MONO_FONT },
        { label: "canonical_url", value: a.canonical_url || "—", font: MONO_FONT, wide: true },
        { label: "og_title", value: a.og_title || "—", font: BODY_FONT },
        { label: "og_description", value: a.og_description || "—", font: BODY_FONT },
        { label: "og_image_url", value: a.og_image_url || "—", font: MONO_FONT },
      ],
    },
  ];
}

export default function AutomationDetailModal({ automation, onClose, onEdit }) {
  if (!automation) return null;
  const groups = buildGroups(automation);

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
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>{automation.title}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", overflowWrap: "anywhere" }}>{automation.id}</div>
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
            Edit automation
          </Button>
        </div>
      </div>
    </div>
  );
}
