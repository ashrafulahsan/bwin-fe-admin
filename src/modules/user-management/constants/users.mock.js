// The list itself comes from GET /users, and "Add user" now posts through
// POST /users + POST /users/{id}/details (modules/user-management/services)
// — see hooks/useUserManagement.js. What's left here are just display maps.
// Status values match the backend's UserStatus enum exactly
// (app/modules/users/constants.py) — "deactivated" replaces the old mock's
// "inactive", which was never a real backend value.
export const USER_STATUSES = ["pending", "active", "suspended", "deactivated"];
export const USER_STATUS_TONES = { pending: "warning", active: "success", suspended: "error", deactivated: "neutral" };
// Matches the backend's Language enum exactly (app/core/constants.py) — it
// only defines "en" and "bn"; anything else 422s on save.
export const LANGUAGES = { en: "English", bn: "Bangla" };

export const fullName = (u) => [u.first_name, u.last_name].filter(Boolean).join(" ");
