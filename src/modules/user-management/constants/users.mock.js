// The list itself now comes from GET /users (modules/user-management/services)
// — see hooks/useUserManagement.js. What's left here are display maps and the
// (still local-only, unwired — see AddUserForm/saveUser) create-form option
// lists. Status values match the backend's UserStatus enum exactly
// (app/modules/users/constants.py) — "deactivated" replaces the old mock's
// "inactive", which was never a real backend value.
export const USER_STATUSES = ["pending", "active", "suspended", "deactivated"];
export const USER_STATUS_TONES = { pending: "warning", active: "success", suspended: "error", deactivated: "neutral" };
export const LANGUAGES = { en: "English", bn: "Bangla", es: "Spanish" };
export const ROLE_CHOICES = ["Super admin", "Content manager", "Finance officer", "Instructor", "Support agent", "Viewer"];

export const fullName = (u) => [u.first_name, u.last_name].filter(Boolean).join(" ");
