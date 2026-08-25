// public.menus (⋈ categories for menu_category_id). Column names match the DB schema.
// In future all data will come from the database.

export const MENU_CATEGORIES = [
  { id: "cat-mn-01", name: "Main navigation", slug: "main-navigation", hint: "Site header — top level shows as tabs, children as dropdowns" },
  { id: "cat-mn-02", name: "Footer", slug: "footer", hint: "Footer columns — top level is a column heading" },
  { id: "cat-mn-03", name: "Client portal", slug: "client-portal", hint: "Left rail inside the logged-in client area" },
  { id: "cat-mn-04", name: "Mobile app", slug: "mobile-app", hint: "Bottom tab bar and its drill-down screens" },
];

const T = "2026-06-14 09:20";

export const MENUS = [
  // ---- Main navigation
  { id: "mn-0001", title: "Skill development", description: "Courses, exams and certificates", icon: "academic-cap", image: "", link: "/skill-development", parent_id: null, menu_category_id: "cat-mn-01", order: 1, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-08 11:02", updated_at: T, deleted_at: null },
  { id: "mn-0002", title: "Courses", description: "Full course catalogue", icon: "book-open", image: "", link: "/skill-development/courses", parent_id: "mn-0001", menu_category_id: "cat-mn-01", order: 1, created_by: "Nadia Rahman", updated_by: "Tanvir Alam", created_at: "2026-01-08 11:05", updated_at: T, deleted_at: null },
  { id: "mn-0003", title: "Live classes", description: "Instructor-led sessions", icon: "video-camera", image: "", link: "/skill-development/classes", parent_id: "mn-0001", menu_category_id: "cat-mn-01", order: 2, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-08 11:06", updated_at: T, deleted_at: null },
  { id: "mn-0004", title: "Certificates", description: "Verify a certificate", icon: "academic-cap", image: "", link: "/skill-development/certificates", parent_id: "mn-0001", menu_category_id: "cat-mn-01", order: 3, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-19 14:40", updated_at: T, deleted_at: null },
  { id: "mn-0005", title: "Diploma tracks", description: "Multi-course programmes", icon: "squares-2x2", image: "", link: "/skill-development/courses?type=diploma", parent_id: "mn-0002", menu_category_id: "cat-mn-01", order: 1, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-02 10:15", updated_at: T, deleted_at: null },
  { id: "mn-0006", title: "Short courses", description: "Under four weeks", icon: "bolt", image: "", link: "/skill-development/courses?type=short", parent_id: "mn-0002", menu_category_id: "cat-mn-01", order: 2, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-02 10:16", updated_at: T, deleted_at: null },

  { id: "mn-0010", title: "Consultancy", description: "Advisory retainers and audits", icon: "briefcase", image: "", link: "/consultancy", parent_id: null, menu_category_id: "cat-mn-01", order: 2, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-08 11:10", updated_at: T, deleted_at: null },
  { id: "mn-0011", title: "Process audit", description: "Two-week diagnostic", icon: "clipboard-document-check", image: "", link: "/consultancy/process-audit", parent_id: "mn-0010", menu_category_id: "cat-mn-01", order: 1, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-08 11:12", updated_at: T, deleted_at: null },
  { id: "mn-0012", title: "Compliance review", description: "Policy and reporting readiness", icon: "shield-check", image: "", link: "/consultancy/compliance", parent_id: "mn-0010", menu_category_id: "cat-mn-01", order: 2, created_by: "Nadia Rahman", updated_by: "Sabrina Haque", created_at: "2026-01-08 11:13", updated_at: T, deleted_at: null },

  { id: "mn-0020", title: "Business automation", description: "Workflow build and handover", icon: "bolt", image: "", link: "/automation", parent_id: null, menu_category_id: "cat-mn-01", order: 3, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-08 11:20", updated_at: T, deleted_at: null },
  { id: "mn-0021", title: "CRM automation", description: "", icon: "users", image: "", link: "/automation/crm", parent_id: "mn-0020", menu_category_id: "cat-mn-01", order: 1, created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-04-11 16:02", updated_at: T, deleted_at: null },
  { id: "mn-0022", title: "Finance workflows", description: "", icon: "banknotes", image: "", link: "/automation/finance", parent_id: "mn-0020", menu_category_id: "cat-mn-01", order: 2, created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-04-11 16:03", updated_at: T, deleted_at: null },

  { id: "mn-0030", title: "Insights", description: "Articles and case studies", icon: "document-text", image: "", link: "/insights", parent_id: null, menu_category_id: "cat-mn-01", order: 4, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-03 09:41", updated_at: T, deleted_at: null },
  { id: "mn-0031", title: "Contact", description: "Talk to a consultant", icon: "chat-bubble-left-right", image: "", link: "/contact", parent_id: null, menu_category_id: "cat-mn-01", order: 5, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-08 11:25", updated_at: T, deleted_at: null },
  { id: "mn-0032", title: "Webinars", description: "Retired — replaced by Live classes", icon: "video-camera", image: "", link: "/webinars", parent_id: null, menu_category_id: "cat-mn-01", order: 6, created_by: "Nadia Rahman", updated_by: "Tanvir Alam", created_at: "2026-01-08 11:28", updated_at: "2026-05-30 12:00", deleted_at: "2026-05-30 12:00" },

  // ---- Footer
  { id: "mn-0100", title: "Services", description: "", icon: "", image: "", link: "", parent_id: null, menu_category_id: "cat-mn-02", order: 1, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-09 10:00", updated_at: T, deleted_at: null },
  { id: "mn-0101", title: "Courses", description: "", icon: "", image: "", link: "/skill-development/courses", parent_id: "mn-0100", menu_category_id: "cat-mn-02", order: 1, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-09 10:01", updated_at: T, deleted_at: null },
  { id: "mn-0102", title: "Consultancy", description: "", icon: "", image: "", link: "/consultancy", parent_id: "mn-0100", menu_category_id: "cat-mn-02", order: 2, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-09 10:01", updated_at: T, deleted_at: null },
  { id: "mn-0103", title: "Automation", description: "", icon: "", image: "", link: "/automation", parent_id: "mn-0100", menu_category_id: "cat-mn-02", order: 3, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-09 10:02", updated_at: T, deleted_at: null },
  { id: "mn-0110", title: "Company", description: "", icon: "", image: "", link: "", parent_id: null, menu_category_id: "cat-mn-02", order: 2, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-09 10:03", updated_at: T, deleted_at: null },
  { id: "mn-0111", title: "About BWIN", description: "", icon: "", image: "", link: "/about", parent_id: "mn-0110", menu_category_id: "cat-mn-02", order: 1, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-09 10:04", updated_at: T, deleted_at: null },
  { id: "mn-0112", title: "Careers", description: "", icon: "", image: "", link: "/careers", parent_id: "mn-0110", menu_category_id: "cat-mn-02", order: 2, created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-03-21 13:30", updated_at: T, deleted_at: null },
  { id: "mn-0120", title: "Legal", description: "", icon: "", image: "", link: "", parent_id: null, menu_category_id: "cat-mn-02", order: 3, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-09 10:05", updated_at: T, deleted_at: null },
  { id: "mn-0121", title: "Privacy policy", description: "", icon: "", image: "", link: "/legal/privacy", parent_id: "mn-0120", menu_category_id: "cat-mn-02", order: 1, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-09 10:06", updated_at: T, deleted_at: null },
  { id: "mn-0122", title: "Terms of service", description: "", icon: "", image: "", link: "/legal/terms", parent_id: "mn-0120", menu_category_id: "cat-mn-02", order: 2, created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-09 10:06", updated_at: T, deleted_at: null },

  // ---- Client portal
  { id: "mn-0200", title: "My dashboard", description: "", icon: "squares-2x2", image: "", link: "/portal", parent_id: null, menu_category_id: "cat-mn-03", order: 1, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-11 08:15", updated_at: T, deleted_at: null },
  { id: "mn-0201", title: "My courses", description: "", icon: "book-open", image: "", link: "/portal/courses", parent_id: null, menu_category_id: "cat-mn-03", order: 2, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-11 08:16", updated_at: T, deleted_at: null },
  { id: "mn-0202", title: "In progress", description: "", icon: "", image: "", link: "/portal/courses?state=active", parent_id: "mn-0201", menu_category_id: "cat-mn-03", order: 1, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-11 08:17", updated_at: T, deleted_at: null },
  { id: "mn-0203", title: "Completed", description: "", icon: "", image: "", link: "/portal/courses?state=done", parent_id: "mn-0201", menu_category_id: "cat-mn-03", order: 2, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-11 08:17", updated_at: T, deleted_at: null },
  { id: "mn-0204", title: "Engagements", description: "Consultancy projects", icon: "briefcase", image: "", link: "/portal/engagements", parent_id: null, menu_category_id: "cat-mn-03", order: 3, created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-02-11 08:20", updated_at: T, deleted_at: null },
  { id: "mn-0205", title: "Invoices", description: "", icon: "banknotes", image: "", link: "/portal/invoices", parent_id: null, menu_category_id: "cat-mn-03", order: 4, created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-02-11 08:21", updated_at: T, deleted_at: null },

  // ---- Mobile app
  { id: "mn-0300", title: "Home", description: "", icon: "squares-2x2", image: "", link: "app://home", parent_id: null, menu_category_id: "cat-mn-04", order: 1, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-05-04 15:00", updated_at: T, deleted_at: null },
  { id: "mn-0301", title: "Learn", description: "", icon: "academic-cap", image: "", link: "app://learn", parent_id: null, menu_category_id: "cat-mn-04", order: 2, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-05-04 15:01", updated_at: T, deleted_at: null },
  { id: "mn-0302", title: "Downloads", description: "Offline lessons", icon: "arrow-down-tray", image: "", link: "app://learn/downloads", parent_id: "mn-0301", menu_category_id: "cat-mn-04", order: 1, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-05-04 15:02", updated_at: T, deleted_at: null },
  { id: "mn-0303", title: "Account", description: "", icon: "user", image: "", link: "app://account", parent_id: null, menu_category_id: "cat-mn-04", order: 3, created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-05-04 15:03", updated_at: T, deleted_at: null },
];
