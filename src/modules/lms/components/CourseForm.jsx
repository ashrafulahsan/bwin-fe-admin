"use client";

import { Button } from "@/components/ui";
import { GenericFieldGroup } from "@/components/forms";
import { COURSE_FORM_GROUPS, COURSE_ADVANCED_GROUPS } from "../constants/courseFormFields";
import {
  COURSE_CATEGORIES,
  COURSE_TYPES,
  DELIVERY_MODES,
  COURSE_LEVELS,
  COURSE_LANGUAGES,
  COURSE_STATUSES,
  COURSE_VISIBILITIES,
} from "../constants/courses.mock";

const capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);
const idOptsBlank = (list, blankLabel) => [{ value: "", label: blankLabel }].concat(list.map((x) => ({ value: x.id, label: x.name })));
const valOptsPlain = (list) => list.map((v) => ({ value: v, label: capitalize(v) }));

function resolveOptions(field) {
  switch (field.optionsFrom) {
    case "categories":
      return idOptsBlank(COURSE_CATEGORIES, "No category");
    case "courseTypes":
      return idOptsBlank(COURSE_TYPES, "Not set");
    case "deliveryModes":
      return idOptsBlank(DELIVERY_MODES, "Not set");
    case "levels":
      return valOptsPlain(COURSE_LEVELS);
    case "languages":
      return valOptsPlain(COURSE_LANGUAGES);
    case "statuses":
      return valOptsPlain(COURSE_STATUSES);
    case "visibilities":
      return valOptsPlain(COURSE_VISIBILITIES);
    default:
      return [];
  }
}

export default function CourseForm({ editing, form, onFieldChange, advancedOpen, onToggleAdvanced, formError, onCancel, onSaveDraft, onSavePublish }) {
  const cardTitle = editing ? editing.title : "Course details";
  const cardHint = editing
    ? "Changes write to the courses row on save — updated_at and updated_by are stamped for you."
    : "Title, course code, slug and full description are required — everything else has a sensible default.";
  const primaryActionLabel = editing ? "Save and publish" : "Create and publish";

  return (
    <div style={{ maxWidth: 1040, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>{cardTitle}</div>
          <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>{cardHint}</div>
        </div>

        <div style={{ padding: "22px 24px 8px", display: "flex", flexDirection: "column", gap: 22 }}>
          {COURSE_FORM_GROUPS.map((group) => (
            <GenericFieldGroup
              key={group.title}
              title={group.title}
              fields={group.fields}
              form={form}
              onFieldChange={onFieldChange}
              resolveOptions={resolveOptions}
              richPlaceholder="The full course page copy — what it covers, who it is for, how it runs."
            />
          ))}

          <button
            type="button"
            onClick={onToggleAdvanced}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "12px 14px",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-sm)",
              background: "var(--surface-card)",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
          >
            <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 14, color: "var(--text-primary)" }}>
              Media, content counts and SEO
            </span>
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>All optional — safe to leave for later</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>{advancedOpen ? "Hide" : "Show"}</span>
          </button>

          {advancedOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {COURSE_ADVANCED_GROUPS.map((group) => (
                <GenericFieldGroup key={group.title} title={group.title} fields={group.fields} form={form} onFieldChange={onFieldChange} resolveOptions={resolveOptions} />
              ))}
            </div>
          )}
        </div>

        {formError && (
          <div style={{ margin: "0 24px", padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--state-error-bg)", color: "var(--state-error)", fontSize: "var(--fs-body-sm)" }}>
            {formError}
          </div>
        )}

        <div style={{ padding: "20px 24px", display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onSaveDraft}>
            Save as draft
          </Button>
          <Button variant="accent" onClick={onSavePublish}>
            {primaryActionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
