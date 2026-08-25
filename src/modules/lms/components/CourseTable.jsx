"use client";

import { Badge, Icon } from "@/components/ui";
import { RowActionButton } from "@/components/tables";
import { darkBadgeStyle } from "@/utils/badgeTone";
import {
  COURSE_LEVEL_TONES,
  COURSE_STATUS_TONES,
  COURSE_CATEGORIES,
  COURSE_TYPES,
  DELIVERY_MODES,
  nameById,
  money,
  durationLabel,
} from "../constants/courses.mock";

const GRID_COLUMNS = "2.2fr 1.2fr 1fr 1fr 1fr 1.2fr 0.9fr 230px";
const headerCellStyle = { fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };
const resourceButtons = [
  { key: "contents", title: "Course contents", icon: "document-text" },
  { key: "reviews", title: "Reviews", icon: "chat-bubble-left-right" },
  { key: "certificates", title: "Certificate templates", icon: "academic-cap" },
  { key: "projects", title: "Projects", icon: "folder" },
  { key: "jobSuccesses", title: "Job successes", icon: "briefcase" },
  { key: "faqs", title: "Course FAQs", icon: "question-mark-circle" },
];

const cap = (v) => String(v || "").charAt(0).toUpperCase() + String(v || "").slice(1);
const day = (v) => (v ? String(v).slice(0, 10) : null);

function ResourceRow() {
  // Course-resource sub-pages (contents, reviews, certificates, projects, job
  // successes, FAQs) aren't built yet — same "not implemented" placeholder
  // the design source used (a console.log). Wired here so the buttons don't
  // silently do nothing; swap for real navigation once those pages exist.
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: "var(--fw-medium)", letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
        Course resources
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {resourceButtons.map((btn) => (
          <RowActionButton
            key={btn.key}
            title={btn.title}
            icon={<Icon name={btn.icon} size={15} />}
            onClick={() => console.log(`Open ${btn.title.toLowerCase()}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default function CourseTable({ rows, noResults, darkMode, onView, onEdit, onDuplicate, onFeature, onPublish, onDelete }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 12, padding: "12px 20px", background: "var(--surface-sunken)", minWidth: 1410 }}>
        <div style={headerCellStyle}>Course</div>
        <div style={headerCellStyle}>Category / type</div>
        <div style={headerCellStyle}>Level</div>
        <div style={headerCellStyle}>Content</div>
        <div style={headerCellStyle}>Price</div>
        <div style={headerCellStyle}>Enrollment window</div>
        <div style={headerCellStyle}>Status</div>
        <div style={{ ...headerCellStyle, textAlign: "right" }}>Actions</div>
      </div>

      {rows.map((c) => {
        const levelTone = COURSE_LEVEL_TONES[c.level] || "neutral";
        const statusTone = COURSE_STATUS_TONES[c.status] || "neutral";
        const win = [day(c.enrollment_start_date), day(c.enrollment_end_date)];
        const published = c.status === "published";
        const isDeleted = !!c.deleted_at;

        return (
          <div
            key={c.id}
            style={{
              display: "grid",
              gridTemplateColumns: GRID_COLUMNS,
              gap: 12,
              padding: "14px 20px",
              borderTop: "1px solid var(--border)",
              alignItems: "center",
              minWidth: 1410,
              background: isDeleted ? "var(--surface-sunken)" : "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 52,
                  height: 36,
                  flex: "none",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  background: "var(--surface-sunken)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  overflow: "hidden",
                }}
              >
                {c.thumbnail ? "IMG" : "no img"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                  <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.title}
                  </span>
                  {c.featured && (
                    <span
                      style={{
                        flex: "none",
                        fontSize: 10,
                        fontWeight: "var(--fw-semibold)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "var(--orange-600)",
                        background: "var(--orange-50)",
                        borderRadius: 999,
                        padding: "2px 7px",
                      }}
                    >
                      Featured
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.course_code} · /{c.slug}
                </div>
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>{nameById(COURSE_CATEGORIES, c.category_id)}</div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
                {nameById(COURSE_TYPES, c.course_type)} · {nameById(DELIVERY_MODES, c.delivery_mode)}
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <Badge tone={levelTone} style={darkBadgeStyle(levelTone, darkMode)}>
                {c.level}
              </Badge>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 4 }}>{cap(c.language)}</div>
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                {c.total_modules}m · {c.total_lessons}l · {c.total_quizzes}q
              </div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {durationLabel(c.duration_hours, c.duration_minutes)}
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                {Number(c.price) === 0 ? "Free" : c.discount_price != null ? money(c.discount_price, c.currency) : money(c.price, c.currency)}
              </div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {c.discount_price != null && Number(c.price) > 0 ? `was ${money(c.price, c.currency)}` : `${c.enrolled} enrolled`}
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                {win[0] ? `${win[0]} → ${win[1] || "open"}` : "always open"}
              </div>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {c.seat_limit ? `${c.enrolled}/${c.seat_limit} seats` : "no seat limit"}
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <Badge tone={statusTone} style={darkBadgeStyle(statusTone, darkMode)}>
                {c.status}
              </Badge>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 4 }}>{cap(c.visibility)}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: "var(--fw-medium)", letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
                  Course details
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <RowActionButton title="View details" icon={<Icon name="eye" size={15} />} onClick={() => onView(c.id)} />
                  <RowActionButton title="Edit course" icon={<Icon name="pencil-square" size={15} />} onClick={() => onEdit(c)} />
                  <RowActionButton title="Duplicate" icon={<Icon name="square-2-stack" size={15} />} onClick={() => onDuplicate(c)} />
                  <RowActionButton
                    title={c.featured ? "Remove from featured" : "Mark as featured"}
                    active={c.featured}
                    activeBg="var(--orange-50)"
                    icon={<Icon name="star" size={15} style={c.featured ? { color: "var(--orange-500)" } : undefined} />}
                    onClick={() => onFeature(c)}
                  />
                  <RowActionButton
                    title={published ? "Unpublish (back to draft)" : "Publish"}
                    icon={<Icon name={published ? "arrow-down-tray" : "arrow-up-tray"} size={15} />}
                    onClick={() => onPublish(c)}
                  />
                  {isDeleted ? (
                    <RowActionButton title="Restore" icon={<Icon name="arrow-path" size={15} />} onClick={() => onDelete(c)} />
                  ) : (
                    <RowActionButton title="Delete (soft)" danger icon={<Icon name="trash" size={15} style={{ color: "var(--state-error)" }} />} onClick={() => onDelete(c)} />
                  )}
                </div>
              </div>
              <ResourceRow />
            </div>
          </div>
        );
      })}

      {noResults && (
        <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
          No courses match these filters — try clearing the search.
        </div>
      )}
    </div>
  );
}
