import { ROLES } from "@/config/permissions";

// Matches the two tabs on the design's login screen (admin-panel-login.dc.html).
// Super Admin signs in through the same "Admin" tab — the backend response
// determines the actual role.
export const LOGIN_ROLE_TABS = [
  { value: ROLES.ADMIN, label: "Admin" },
  { value: ROLES.INSTRUCTOR, label: "Instructor" },
];

export const LOGIN_SUBMIT_LABELS = {
  [ROLES.ADMIN]: "Sign in as admin",
  [ROLES.INSTRUCTOR]: "Sign in as instructor",
};

// Accepts either a work email or a phone number, same rule as the design source.
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const PHONE_PATTERN = /^\+?[\d\s()-]{7,}$/;
