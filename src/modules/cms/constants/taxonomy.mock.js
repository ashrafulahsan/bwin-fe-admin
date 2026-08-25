// public.category_types and public.categories. Column names match the DB schema.
// In future all data will come from the database.

const T = "2026-07-30 10:15";

export const CATEGORY_TYPES = [
  { id: "ct-01", name: "Menu category", slug: "menu-category", description: "Groups menu items into a navigation area (header, footer, portal rail).", status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-06 09:00", updated_at: T, deleted_at: null },
  { id: "ct-02", name: "Post category", slug: "post-category", description: "Topic buckets for insights articles and case studies.", status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-01-06 09:04", updated_at: T, deleted_at: null },
  { id: "ct-03", name: "Slider category", slug: "slider-category", description: "Which slider a slide belongs to.", status: "active", created_by: "Nadia Rahman", updated_by: "Sabrina Haque", created_at: "2026-01-11 14:20", updated_at: T, deleted_at: null },
  { id: "ct-04", name: "Service category", slug: "service-category", description: "Service lines used across courses, consultancy and automation.", status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-02-02 11:30", updated_at: T, deleted_at: null },
  { id: "ct-05", name: "Course category", slug: "course-category", description: "Catalogue filters on the skill development pages.", status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-18 16:05", updated_at: T, deleted_at: null },
  { id: "ct-06", name: "Tag", slug: "tag", description: "Free-form labels attached to any content type.", status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-03-04 08:45", updated_at: T, deleted_at: null },
  { id: "ct-08", name: "List category", slug: "list-category", description: "Categories whose entries are managed in CMS → List.", status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-03-10 08:55", updated_at: T, deleted_at: null },
  { id: "ct-07", name: "Gallery category", slug: "gallery-category", description: "Retired — media library now uses folders.", status: "inactive", created_by: "Nadia Rahman", updated_by: "Tanvir Alam", created_at: "2026-01-20 10:00", updated_at: "2026-06-12 09:10", deleted_at: null },
];

export const CATEGORIES = [
  // Menu category
  { id: "c-101", name: "Main menu", slug: "main-menu", description: "Site header navigation", category_type_id: "ct-01", parent_category_id: null, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-08 10:10", updated_at: T, deleted_at: null },
  { id: "c-102", name: "Mega menu", slug: "mega-menu", description: "Expanded panel under the main menu", category_type_id: "ct-01", parent_category_id: "c-101", status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-14 11:00", updated_at: T, deleted_at: null },
  { id: "c-103", name: "Footer menu", slug: "footer-menu", description: "Footer link columns", category_type_id: "ct-01", parent_category_id: null, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-08 10:12", updated_at: T, deleted_at: null },
  { id: "c-104", name: "Client portal rail", slug: "client-portal-rail", description: "Left rail inside the logged-in area", category_type_id: "ct-01", parent_category_id: null, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-01-19 15:40", updated_at: T, deleted_at: null },
  { id: "c-105", name: "Mobile app tabs", slug: "mobile-app-tabs", description: "Bottom tab bar", category_type_id: "ct-01", parent_category_id: null, status: "draft", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-05-06 09:25", updated_at: T, deleted_at: null },

  // Post category
  { id: "c-201", name: "Skill development", slug: "skill-development", description: "Training and certification writing", category_type_id: "ct-02", parent_category_id: null, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-01-10 09:00", updated_at: T, deleted_at: null },
  { id: "c-202", name: "Exam prep", slug: "exam-prep", description: "", category_type_id: "ct-02", parent_category_id: "c-201", status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-01-10 09:03", updated_at: T, deleted_at: null },
  { id: "c-203", name: "Consultancy", slug: "consultancy", description: "Advisory practice notes", category_type_id: "ct-02", parent_category_id: null, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-10 09:05", updated_at: T, deleted_at: null },
  { id: "c-204", name: "Compliance", slug: "compliance", description: "", category_type_id: "ct-02", parent_category_id: "c-203", status: "active", created_by: "Nadia Rahman", updated_by: "Sabrina Haque", created_at: "2026-01-10 09:06", updated_at: T, deleted_at: null },
  { id: "c-205", name: "Automation", slug: "automation", description: "Workflow build stories", category_type_id: "ct-02", parent_category_id: null, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-01-10 09:08", updated_at: T, deleted_at: null },
  { id: "c-206", name: "Case studies", slug: "case-studies", description: "", category_type_id: "ct-02", parent_category_id: null, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-21 13:12", updated_at: T, deleted_at: null },
  { id: "c-207", name: "Press", slug: "press", description: "Archived — merged into Case studies", category_type_id: "ct-02", parent_category_id: null, status: "inactive", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-01 10:00", updated_at: "2026-06-02 12:00", deleted_at: "2026-06-02 12:00" },

  // Slider category
  { id: "c-301", name: "Hero slider", slug: "hero-slider", description: "Home page hero rotation", category_type_id: "ct-03", parent_category_id: null, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-12 10:00", updated_at: T, deleted_at: null },
  { id: "c-302", name: "Client logos", slug: "client-logos", description: "Logo marquee under the hero", category_type_id: "ct-03", parent_category_id: null, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-01-12 10:04", updated_at: T, deleted_at: null },
  { id: "c-303", name: "Testimonials", slug: "testimonials", description: "", category_type_id: "ct-03", parent_category_id: null, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-01-12 10:06", updated_at: T, deleted_at: null },

  // Service category
  { id: "c-401", name: "Skill development", slug: "service-skill-development", description: "", category_type_id: "ct-04", parent_category_id: null, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-02-02 11:35", updated_at: T, deleted_at: null },
  { id: "c-402", name: "Consultancy", slug: "service-consultancy", description: "", category_type_id: "ct-04", parent_category_id: null, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-02-02 11:36", updated_at: T, deleted_at: null },
  { id: "c-403", name: "Process audit", slug: "process-audit", description: "", category_type_id: "ct-04", parent_category_id: "c-402", status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-02-02 11:38", updated_at: T, deleted_at: null },
  { id: "c-404", name: "Business automation", slug: "business-automation", description: "", category_type_id: "ct-04", parent_category_id: null, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-02-02 11:40", updated_at: T, deleted_at: null },
  { id: "c-405", name: "CRM automation", slug: "crm-automation", description: "", category_type_id: "ct-04", parent_category_id: "c-404", status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-04-11 16:10", updated_at: T, deleted_at: null },
  { id: "c-406", name: "Finance workflows", slug: "finance-workflows", description: "", category_type_id: "ct-04", parent_category_id: "c-404", status: "draft", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-04-11 16:11", updated_at: T, deleted_at: null },

  // Course category
  { id: "c-501", name: "Diploma tracks", slug: "diploma-tracks", description: "Multi-course programmes", category_type_id: "ct-05", parent_category_id: null, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-18 16:10", updated_at: T, deleted_at: null },
  { id: "c-502", name: "Short courses", slug: "short-courses", description: "Under four weeks", category_type_id: "ct-05", parent_category_id: null, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-02-18 16:11", updated_at: T, deleted_at: null },
  { id: "c-503", name: "Live classes", slug: "live-classes", description: "", category_type_id: "ct-05", parent_category_id: null, status: "active", created_by: "Tanvir Alam", updated_by: "Nadia Rahman", created_at: "2026-02-18 16:12", updated_at: T, deleted_at: null },

  // List category
  { id: "c-701", name: "FAQ", slug: "faq", description: "Questions shown on the help page", category_type_id: "ct-08", parent_category_id: null, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-03-10 09:00", updated_at: T, deleted_at: null },
  { id: "c-702", name: "Event", slug: "event", description: "Workshops, webinars and meetups", category_type_id: "ct-08", parent_category_id: null, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-10 09:05", updated_at: T, deleted_at: null },
  { id: "c-703", name: "Team member", slug: "team-member", description: "People shown on the about page", category_type_id: "ct-08", parent_category_id: null, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-03-10 09:08", updated_at: T, deleted_at: null },
  { id: "c-704", name: "Download", slug: "download", description: "Brochures and guides in the resource centre", category_type_id: "ct-08", parent_category_id: null, status: "draft", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-06-01 10:20", updated_at: T, deleted_at: null },

  // Tag
  { id: "c-601", name: "Beginner", slug: "beginner", description: "", category_type_id: "ct-06", parent_category_id: null, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-04 08:50", updated_at: T, deleted_at: null },
  { id: "c-602", name: "Advanced", slug: "advanced", description: "", category_type_id: "ct-06", parent_category_id: null, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-04 08:51", updated_at: T, deleted_at: null },
  { id: "c-603", name: "SME", slug: "sme", description: "Small and medium enterprise content", category_type_id: "ct-06", parent_category_id: null, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-03-04 08:53", updated_at: T, deleted_at: null },
  { id: "c-604", name: "Government", slug: "government", description: "", category_type_id: "ct-06", parent_category_id: null, status: "draft", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-05-22 09:15", updated_at: T, deleted_at: null },
];

// Rough "in use" counts (menus, posts, courses referencing a category) — read-only in the UI.
export const CATEGORY_USAGE = {
  "c-101": 14, "c-102": 6, "c-103": 9, "c-104": 11, "c-105": 0,
  "c-201": 23, "c-202": 7, "c-203": 18, "c-204": 5, "c-205": 26, "c-206": 12, "c-207": 3,
  "c-301": 5, "c-302": 18, "c-303": 9,
  "c-401": 3, "c-402": 4, "c-403": 2, "c-404": 6, "c-405": 3, "c-406": 0,
  "c-501": 8, "c-502": 19, "c-503": 6,
  "c-701": 5, "c-702": 3, "c-703": 2, "c-704": 0,
  "c-601": 31, "c-602": 14, "c-603": 22, "c-604": 0,
};
