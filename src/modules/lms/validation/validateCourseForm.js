import { plainText } from "@/utils/plainText";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

// Sequential, single-message validation — mirrors the design source's
// validate() exactly (one error banner at a time, checked in this order).
// `allCourses` is the current list (including any in-memory additions),
// used to reject a duplicate slug/course_code client-side; `editId` excludes
// the row being edited from that duplicate check.
export function validateCourseForm(form, allCourses, editId) {
  if (!form.title.trim()) return "Course title is required.";
  if (!form.course_code.trim()) return "Course code is required — it is a NOT NULL column.";
  if (!form.slug.trim()) return "Slug is required.";
  if (!SLUG_PATTERN.test(form.slug.trim())) return "Slug can only contain lowercase letters, numbers and hyphens.";
  if (!plainText(form.description)) return "Full description is required — it is a NOT NULL column.";

  const dupe = allCourses.find(
    (c) => c.id !== editId && (c.slug === form.slug.trim() || c.course_code === form.course_code.trim())
  );
  if (dupe) return `That course code or slug is already used by "${dupe.title}".`;

  const score = parseInt(form.passing_score, 10) || 0;
  if (score < 0 || score > 100) return "Passing score must be between 0 and 100.";

  if (form.discount_price !== "" && Number(form.discount_price) >= Number(form.price || 0)) {
    return "Discount price must be lower than the regular price.";
  }
  if (form.enrollment_start_date && form.enrollment_end_date && form.enrollment_end_date < form.enrollment_start_date) {
    return "Enrollment end date cannot be before the start date.";
  }
  if (form.course_start_date && form.course_end_date && form.course_end_date < form.course_start_date) {
    return "Course end date cannot be before the start date.";
  }
  return null;
}
