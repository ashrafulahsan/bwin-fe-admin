// public.roles ⋈ role_permissions ⋈ permissions, mirroring the Claude Design
// source (BWIN Consultants admin panel/data/roles.js). Replace with
// modules/user-management/services once the roles/permissions API exists.
export const ROLES = [
  {
    id: "r-1",
    name: "Super admin",
    slug: "super-admin",
    level: 100,
    is_system: true,
    description: "Full access to every module, setting and user.",
    users_count: 2,
    created_at: "2023-01-04",
    permission_codes: ["users.manage", "roles.manage", "cms.manage", "lms.manage", "reports.view", "settings.manage"],
  },
  {
    id: "r-2",
    name: "Content manager",
    slug: "content-manager",
    level: 60,
    is_system: false,
    description: "Manages LMS and CMS content. No user or billing access.",
    users_count: 6,
    created_at: "2023-02-11",
    permission_codes: ["cms.manage", "lms.manage", "media.upload"],
  },
  {
    id: "r-3",
    name: "Finance officer",
    slug: "finance-officer",
    level: 50,
    is_system: false,
    description: "Views and manages financial reports and invoices.",
    users_count: 3,
    created_at: "2023-04-20",
    permission_codes: ["reports.view", "invoices.manage"],
  },
  {
    id: "r-4",
    name: "Instructor",
    slug: "instructor",
    level: 45,
    is_system: false,
    description: "Creates courses, mock tests and course material.",
    users_count: 96,
    created_at: "2023-05-08",
    permission_codes: ["lms.manage", "media.upload"],
  },
  {
    id: "r-5",
    name: "Support agent",
    slug: "support-agent",
    level: 40,
    is_system: false,
    description: "Handles contact forms, comments and support tickets.",
    users_count: 5,
    created_at: "2023-06-30",
    permission_codes: ["communication.manage", "comments.moderate"],
  },
  {
    id: "r-6",
    name: "Viewer",
    slug: "viewer",
    level: 10,
    is_system: true,
    description: "Read-only access to dashboards and reports.",
    users_count: 8,
    created_at: "2023-01-04",
    permission_codes: ["reports.view"],
  },
];

// public.permissions — code = "<resource>.<action>"
export const PERMISSIONS = [
  { id: "p-1", code: "users.manage", resource: "users", action: "manage", name: "Manage users", is_system: true, description: "Create, edit and delete user accounts." },
  { id: "p-2", code: "roles.manage", resource: "roles", action: "manage", name: "Manage roles", is_system: true, description: "Create roles and grant permissions." },
  { id: "p-3", code: "cms.manage", resource: "cms", action: "manage", name: "Manage CMS", is_system: false, description: "Pages, articles, menus and taxonomy." },
  { id: "p-4", code: "lms.manage", resource: "lms", action: "manage", name: "Manage LMS", is_system: false, description: "Courses, lessons, quizzes and materials." },
  { id: "p-5", code: "media.upload", resource: "media", action: "upload", name: "Upload media", is_system: false, description: "Upload files to the media library." },
  { id: "p-6", code: "reports.view", resource: "reports", action: "view", name: "View reports", is_system: false, description: "Read all reporting dashboards." },
  { id: "p-7", code: "invoices.manage", resource: "invoices", action: "manage", name: "Manage invoices", is_system: false, description: "Issue, edit and void invoices." },
  { id: "p-8", code: "communication.manage", resource: "communication", action: "manage", name: "Manage communication", is_system: false, description: "Messages, notifications, newsletters." },
  { id: "p-9", code: "comments.moderate", resource: "comments", action: "moderate", name: "Moderate comments", is_system: false, description: "Approve, hide and delete comments." },
  { id: "p-10", code: "settings.manage", resource: "settings", action: "manage", name: "Manage settings", is_system: true, description: "Site-wide configuration." },
];

export const RESOURCES = ["users", "roles", "cms", "lms", "media", "reports", "invoices", "communication", "comments", "settings"];
