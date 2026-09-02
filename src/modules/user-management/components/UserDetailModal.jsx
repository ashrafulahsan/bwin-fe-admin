"use client";

import { Button } from "@/components/ui";
import { USER_FORM_GROUPS } from "../constants/userFormFields";

const BODY_FONT = "var(--font-body)";
const MONO_FONT = "var(--font-mono)";

// user_details groups (Personal, Address, Professional, Educational, Social,
// Emergency) reuse the same {title, fields:[{key,label}]} definitions the
// "Add user" form uses — one source of truth for how this data is grouped.
// Only the Basic (users) section is its own list below: the view shows
// read-only account metadata (verification, login, roles, timestamps) that
// the create form never collects.
const DETAIL_GROUPS = USER_FORM_GROUPS.slice(1);
const MONO_DETAIL_KEYS = new Set([
  "date_of_birth",
  "years_of_experience",
  "graduation_year",
  "linkedin_url",
  "youtube_url",
  "facebook_url",
  "website_url",
  "emergency_contact_phone",
]);

function buildBasicFields(user, roleNamesOf) {
  return [
    { label: "first_name", value: user.first_name, font: BODY_FONT },
    { label: "last_name", value: user.last_name || "—", font: BODY_FONT },
    { label: "email", value: user.email || "—", font: BODY_FONT },
    { label: "phone", value: user.phone || "—", font: MONO_FONT },
    { label: "bio", value: user.bio || "—", font: BODY_FONT },
    { label: "status", value: user.status, font: BODY_FONT },
    { label: "language", value: user.language, font: MONO_FONT },
    { label: "roles (user_roles)", value: roleNamesOf(user).join(", ") || "—", font: BODY_FONT },
    { label: "email_verified", value: user.email_verified ? "verified" : "not verified", font: MONO_FONT },
    { label: "phone_verified", value: user.phone_verified ? "verified" : "not verified", font: MONO_FONT },
    { label: "is_social_login", value: String(user.is_social_login), font: MONO_FONT },
    { label: "social_provider", value: user.social_provider || "—", font: MONO_FONT },
    { label: "last_login_at", value: user.last_login_at || "never", font: MONO_FONT },
    { label: "created_at", value: user.created_at, font: MONO_FONT },
    { label: "updated_at", value: user.updated_at, font: MONO_FONT },
  ];
}

function buildDetailGroups(details) {
  if (!details) return [];
  return DETAIL_GROUPS.map((group) => ({
    title: group.title,
    fields: group.fields.map((f) => ({
      label: f.label,
      value: details[f.key] ?? null,
      font: MONO_DETAIL_KEYS.has(f.key) ? MONO_FONT : BODY_FONT,
    })),
  }));
}

function FieldGrid({ fields }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
      {fields.map((f) => (
        <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>{f.label}</span>
          <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: f.font, overflowWrap: "anywhere" }}>
            {f.value === null || f.value === undefined || f.value === "" ? "—" : String(f.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <fieldset style={{ margin: 0, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px 20px" }}>
      <legend style={{ padding: "0 8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" }}>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export default function UserDetailModal({ user, detailsLoading, roleNamesOf, onClose }) {
  if (!user) return null;
  const title = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const basicFields = buildBasicFields(user, roleNamesOf);
  const detailGroups = buildDetailGroups(user.details);

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
          maxWidth: 760,
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

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18, maxHeight: "70vh", overflowY: "auto" }}>
          <Section title="Basic (users)">
            <FieldGrid fields={basicFields} />
          </Section>

          {detailsLoading && (
            <div style={{ padding: "10px 2px", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>Loading details…</div>
          )}

          {!detailsLoading && detailGroups.length === 0 && (
            <div style={{ padding: "10px 2px", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
              No user_details row for this user yet — personal, address, professional, educational, social and emergency fields are all unset.
            </div>
          )}

          {detailGroups.map((group) => (
            <Section key={group.title} title={group.title}>
              <FieldGrid fields={group.fields} />
            </Section>
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
