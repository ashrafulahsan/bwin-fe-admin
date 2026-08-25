// Role identifiers. Actual permission checks must be validated against the backend (FastAPI) response,
// this file only defines the shape used on the frontend for RBAC-driven UI rendering.
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
};

// TODO: derive from backend permissions payload per authenticated user.
export const PERMISSIONS = {};
