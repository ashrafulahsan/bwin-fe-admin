import { ROUTES } from "./routes";
import { ROLES } from "./permissions";

// Sidebar is configuration-driven: add/remove entries here rather than hardcoding markup in Sidebar.jsx.
export const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INSTRUCTOR],
  },
  {
    label: "User Management",
    href: ROUTES.USER_MANAGEMENT,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    label: "CMS",
    href: ROUTES.CMS,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    label: "LMS",
    href: ROUTES.LMS,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INSTRUCTOR],
  },
  {
    label: "Business",
    href: ROUTES.BUSINESS,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    label: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INSTRUCTOR],
  },
  {
    label: "Support Tickets",
    href: ROUTES.SUPPORT_TICKETS,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    label: "Reports",
    href: ROUTES.REPORTS,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    label: "Activity Logs",
    href: ROUTES.ACTIVITY_LOGS,
    roles: [ROLES.SUPER_ADMIN],
  },
];
