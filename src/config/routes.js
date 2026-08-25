// Centralized route path definitions. Keep in sync with app/(auth) and app/(dashboard)
// route groups, and with config/sidebar.js (which drives navigation off these values).
// Grouping mirrors the sidebar structure in the Claude Design source
// (BWIN Consultants admin panel/data/admin-menu.js).
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",

  // Users
  USER_MANAGEMENT: "/user-management",
  ROLE_PERMISSION: "/user-management/roles",
  ACTIVITY_LOGS: "/activity-logs",

  // Skill development (LMS)
  LMS: "/lms",
  LMS_COURSES: "/lms/courses",
  LMS_CLASSES: "/lms/classes",
  LMS_EXAMS: "/lms/exams",
  LMS_CERTIFICATES: "/lms/certificates",
  LMS_OFFERS: "/lms/offers",
  LMS_SETTINGS: "/lms/settings",

  // Business
  CONSULTANCY: "/consultancy",
  AUTOMATION: "/automation",

  // Client communication
  COMMUNICATION: "/communication",
  CONTACT_FORMS: "/communication/contact-forms",
  NOTIFICATIONS: "/communication/notifications",
  NEWSLETTER: "/communication/newsletter",
  SUPPORT_TICKETS: "/communication/support-tickets",
  ANNOUNCEMENTS: "/communication/announcements",

  // Reports
  REPORTS: "/reports",
  REPORT_USERS: "/reports/users",
  REPORT_VISITORS: "/reports/visitors",
  REPORT_COMMUNICATIONS: "/reports/communications",
  REPORT_FINANCIALS: "/reports/financials",
  REPORT_SKILL_DEVELOPMENT: "/reports/skill-development",
  REPORT_CONSULTANCY: "/reports/consultancy",
  REPORT_AUTOMATION: "/reports/automation",

  // CMS
  CMS: "/cms",
  CMS_MENU: "/cms/menu",
  CMS_TAXONOMY: "/cms/taxonomy",
  CMS_LISTS: "/cms/lists",
  CMS_ARTICLES: "/cms/articles",
  CMS_PAGES: "/cms/pages",
  CMS_FORMS: "/cms/forms",
  CMS_SETTINGS: "/cms/settings",

  // Account
  PROFILE: "/profile",
  SETTINGS: "/settings",
};
