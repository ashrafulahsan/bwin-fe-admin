import { plainText } from "@/utils/plainText";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

// Sequential, single-message validation — mirrors the design source's
// validate() exactly (one error banner at a time, checked in this order).
export function validateConsultancyForm(form, allConsultancies, editId) {
  if (!form.title.trim()) return "Title is required.";
  if (!form.consultancy_code.trim()) return "Consultancy code is required — it is a NOT NULL column.";
  if (!form.slug.trim()) return "Slug is required.";
  if (!SLUG_PATTERN.test(form.slug.trim())) return "Slug can only contain lowercase letters, numbers and hyphens.";
  if (!plainText(form.description)) return "Description is required — it is a NOT NULL column.";

  const dupe = allConsultancies.find(
    (c) => c.id !== editId && (c.slug === form.slug.trim() || c.consultancy_code === form.consultancy_code.trim())
  );
  if (dupe) return `That code or slug is already used by "${dupe.title}".`;
  return null;
}
