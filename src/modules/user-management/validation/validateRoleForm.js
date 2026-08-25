import { slugify } from "@/utils/slugify";

// Sequential, single-message validation — mirrors the design source's
// saveRole() exactly (one error banner at a time, checked in this order).
export function validateRoleForm(form, existingRoles) {
  const name = form.name.trim();
  const level = Number(form.level);

  if (!name) return "Give the role a name before saving.";
  const slug = form.slug || slugify(name);
  if (existingRoles.some((r) => r.slug === slug)) return "That slug is already taken — pick another.";
  if (!(level >= 0 && level <= 100)) return "Level must be between 0 and 100.";
  if (!form.codes.length) return "Grant at least one permission.";
  return null;
}
