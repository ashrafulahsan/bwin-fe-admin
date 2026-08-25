const SLUG_PATTERN = /^[a-z0-9-]+$/;

// Sequential, single-message validation — mirrors the design source's
// validate() exactly (one error banner at a time, checked in this order).
// Note description is NOT required here, unlike courses/consultancies —
// that's a deliberate difference in the design source, not an oversight.
export function validateAutomationForm(form, allAutomations, editId) {
  if (!form.title.trim()) return "Title is required.";
  if (!form.slug.trim()) return "Slug is required.";
  if (!SLUG_PATTERN.test(form.slug.trim())) return "Slug can only contain lowercase letters, numbers and hyphens.";

  const dupe = allAutomations.find((a) => a.id !== editId && a.slug === form.slug.trim());
  if (dupe) return `That slug is already used by "${dupe.title}".`;
  return null;
}
