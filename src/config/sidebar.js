import { ROUTES } from "./routes";
import { ROLES } from "./permissions";

const ALL_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INSTRUCTOR];
const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN];

// Sidebar is configuration-driven: add/remove entries here rather than hardcoding
// markup in Sidebar.jsx. Structure (grouping, icons, labels) matches the Claude
// Design source (BWIN Consultants admin panel/data/admin-menu.js) one-to-one;
// only the `href`s are adapted to this app's actual route paths.
export const SIDEBAR_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "squares-2x2", href: ROUTES.DASHBOARD, roles: ALL_ROLES },
  {
    key: "users",
    label: "Users",
    icon: "users",
    roles: ADMIN_ROLES,
    children: [
      { key: "user-management", label: "User management", href: ROUTES.USER_MANAGEMENT, roles: ADMIN_ROLES },
      { key: "role-permission", label: "Role and permission management", href: ROUTES.ROLE_PERMISSION, roles: [ROLES.SUPER_ADMIN] },
      { key: "activity-logs", label: "Activity logs", href: ROUTES.ACTIVITY_LOGS, roles: [ROLES.SUPER_ADMIN] },
    ],
  },
  {
    key: "lms",
    label: "Skill development",
    icon: "academic-cap",
    roles: ALL_ROLES,
    children: [
      { key: "courses", label: "Courses", href: ROUTES.LMS_COURSES, roles: ALL_ROLES },
      { key: "online-classes", label: "Online classes", href: ROUTES.LMS_CLASSES, roles: ALL_ROLES },
      { key: "exams", label: "Exams", href: ROUTES.LMS_EXAMS, roles: ALL_ROLES },
      { key: "certificates", label: "Certificates", href: ROUTES.LMS_CERTIFICATES, roles: ALL_ROLES },
      { key: "offers", label: "Offers", href: ROUTES.LMS_OFFERS, roles: ADMIN_ROLES },
      { key: "lms-settings", label: "Settings", href: ROUTES.LMS_SETTINGS, roles: ADMIN_ROLES },
    ],
  },
  { key: "consultancy", label: "Consultancy service", icon: "briefcase", href: ROUTES.CONSULTANCY, roles: ADMIN_ROLES },
  { key: "automation", label: "Business automation", icon: "bolt", href: ROUTES.AUTOMATION, roles: ADMIN_ROLES },
  {
    key: "communication",
    label: "Client communication",
    icon: "chat-bubble-left-right",
    roles: ALL_ROLES,
    children: [
      { key: "contact-forms", label: "Contact forms", href: ROUTES.CONTACT_FORMS, roles: ADMIN_ROLES },
      { key: "notification", label: "Notification", href: ROUTES.NOTIFICATIONS, roles: ALL_ROLES },
      { key: "newsletter", label: "Newsletter", href: ROUTES.NEWSLETTER, roles: ADMIN_ROLES },
      { key: "support-tickets", label: "Support ticket", href: ROUTES.SUPPORT_TICKETS, roles: ADMIN_ROLES },
      { key: "announcement", label: "Announcement", href: ROUTES.ANNOUNCEMENTS, roles: ADMIN_ROLES },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    icon: "chart-bar",
    roles: ADMIN_ROLES,
    children: [
      { key: "report-users", label: "Users", href: ROUTES.REPORT_USERS, roles: ADMIN_ROLES },
      { key: "report-visitors", label: "Visitors", href: ROUTES.REPORT_VISITORS, roles: ADMIN_ROLES },
      { key: "report-communications", label: "Communications", href: ROUTES.REPORT_COMMUNICATIONS, roles: ADMIN_ROLES },
      { key: "report-financials", label: "Financials", href: ROUTES.REPORT_FINANCIALS, roles: ADMIN_ROLES },
      { key: "report-skill-development", label: "Skill development", href: ROUTES.REPORT_SKILL_DEVELOPMENT, roles: ADMIN_ROLES },
      { key: "report-consultancy-service", label: "Consultancy service", href: ROUTES.REPORT_CONSULTANCY, roles: ADMIN_ROLES },
      { key: "report-business-automation", label: "Business automation", href: ROUTES.REPORT_AUTOMATION, roles: ADMIN_ROLES },
    ],
  },
  {
    key: "cms",
    label: "CMS",
    icon: "document-text",
    roles: ADMIN_ROLES,
    children: [
      { key: "menu", label: "Menu", href: ROUTES.CMS_MENU, roles: ADMIN_ROLES },
      { key: "category-tag", label: "Category & tag", href: ROUTES.CMS_TAXONOMY, roles: ADMIN_ROLES },
      { key: "list", label: "List", href: ROUTES.CMS_LISTS, roles: ADMIN_ROLES },
      { key: "article", label: "Article", href: ROUTES.CMS_ARTICLES, roles: ADMIN_ROLES },
      { key: "page", label: "Page", href: ROUTES.CMS_PAGES, roles: ADMIN_ROLES },
      { key: "form", label: "Form", href: ROUTES.CMS_FORMS, roles: ADMIN_ROLES },
      { key: "site-settings", label: "Site settings", href: ROUTES.CMS_SETTINGS, roles: [ROLES.SUPER_ADMIN] },
    ],
  },
];

// Topbar profile dropdown
export const PROFILE_MENU = [
  { key: "profile", label: "Profile", icon: "user", href: ROUTES.PROFILE },
  { key: "settings", label: "Settings", icon: "cog-6-tooth", href: ROUTES.SETTINGS },
];

// Filters the sidebar tree down to what `role` can see. With no role yet
// (auth not wired up / still loading), the full tree is shown rather than
// nothing — real gating still happens on the backend per request.
export function getVisibleSidebarItems(role) {
  if (!role) return SIDEBAR_ITEMS;
  return SIDEBAR_ITEMS.filter((item) => item.roles.includes(role))
    .map((item) => {
      if (!item.children) return item;
      const children = item.children.filter((child) => child.roles.includes(role));
      return children.length ? { ...item, children } : null;
    })
    .filter(Boolean);
}
