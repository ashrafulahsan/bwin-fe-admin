"use client";

import { Button } from "@/components/ui";

const BODY_FONT = "var(--font-body)";
const MONO_FONT = "var(--font-mono)";

function buildDetailFields(user, roleNamesOf) {
  if (!user) return [];
  const base = [
    { label: "first_name", value: user.first_name, font: BODY_FONT },
    { label: "last_name", value: user.last_name || "—", font: BODY_FONT },
    { label: "email", value: user.email || "—", font: BODY_FONT },
    { label: "phone", value: user.phone || "—", font: MONO_FONT },
    { label: "status", value: user.status, font: BODY_FONT },
    { label: "language", value: user.language, font: MONO_FONT },
    { label: "roles (user_roles)", value: roleNamesOf(user).join(", ") || "—", font: BODY_FONT },
    { label: "email_verified", value: user.email_verified ? "verified" : "not verified", font: MONO_FONT },
    { label: "phone_verified", value: user.phone_verified ? "verified" : "not verified", font: MONO_FONT },
    { label: "is_social_login", value: String(user.is_social_login), font: MONO_FONT },
    { label: "social_provider", value: user.social_provider || "—", font: MONO_FONT },
    { label: "last_login_at", value: user.last_login_at || "never", font: MONO_FONT },
    { label: "created_at", value: user.created_at, font: MONO_FONT },
  ];
  if (!user.details) return base;
  const d = user.details;
  return base.concat([
    { label: "gender", value: d.gender || "—", font: BODY_FONT },
    { label: "date_of_birth", value: d.date_of_birth || "—", font: MONO_FONT },
    { label: "nationality", value: d.nationality || "—", font: BODY_FONT },
    { label: "address", value: d.address || "—", font: BODY_FONT },
    { label: "city", value: d.city || "—", font: BODY_FONT },
    { label: "country", value: d.country || "—", font: BODY_FONT },
    { label: "designation", value: d.designation || "—", font: BODY_FONT },
    { label: "department", value: d.department || "—", font: BODY_FONT },
    { label: "organization", value: d.organization || "—", font: BODY_FONT },
    { label: "years_of_experience", value: d.years_of_experience || "—", font: MONO_FONT },
    { label: "highest_degree", value: d.highest_degree || "—", font: BODY_FONT },
    { label: "university", value: d.university || "—", font: BODY_FONT },
    { label: "graduation_year", value: d.graduation_year || "—", font: MONO_FONT },
    { label: "linkedin_url", value: d.linkedin_url || "—", font: MONO_FONT },
    { label: "website_url", value: d.website_url || "—", font: MONO_FONT },
    { label: "emergency_contact_name", value: d.emergency_contact_name || "—", font: BODY_FONT },
    { label: "emergency_contact_phone", value: d.emergency_contact_phone || "—", font: MONO_FONT },
    { label: "notes", value: d.notes || "—", font: BODY_FONT },
  ]);
}

export default function UserDetailModal({ user, roleNamesOf, onClose }) {
  if (!user) return null;
  const title = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const fields = buildDetailFields(user, roleNamesOf);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,25,47,0.45)",
        zIndex: 60,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 20px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 680,
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>
              {title}
            </div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", overflowWrap: "anywhere" }}>
              {user.id}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              flex: "none",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 16,
              lineHeight: 1,
              cursor: "pointer",
            }}
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

        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
          {fields.map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>{f.label}</span>
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: f.font, overflowWrap: "anywhere" }}>
                {f.value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: "8px 24px 20px", display: "flex", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
