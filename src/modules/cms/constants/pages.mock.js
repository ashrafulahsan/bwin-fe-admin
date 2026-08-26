// public.pages. In future all data will come from the database.

const T = "2026-08-20 14:05";

export const PAGE_AUTHORS = [
  { id: "u-01", name: "Nadia Rahman" },
  { id: "u-02", name: "Tanvir Alam" },
  { id: "u-03", name: "Sabrina Haque" },
  { id: "u-04", name: "Imran Chowdhury" },
];

export const PAGES = [
  {
    id: "pg-0001", title: "Home", slug: "home", description: "Landing page — hero slider, service lines, client logos and the latest insights.",
    content: "BWIN helps operations teams train, tighten and automate...", thumbnail_image: "pages/home.jpg", thumbnail_image_alt: "BWIN home page hero",
    status: "published", published_at: "2026-01-06 09:00", is_featured: true,
    created_by: "u-01", updated_by: "u-01", created_at: "2026-01-04 10:00", updated_at: T, deleted_at: null,
    meta_title: "BWIN Consultants — training, consultancy and business automation", meta_description: "Skill development, advisory and workflow automation for operations teams in Bangladesh.",
    meta_keywords: "consultancy, automation, training", canonical_url: "https://bwin.example/", og_title: "BWIN Consultants", og_description: "Train, tighten and automate your operations.", og_image_url: "pages/home-og.jpg", meta_robots: "index, follow",
  },
  {
    id: "pg-0002", title: "About BWIN", slug: "about", description: "Who we are, how we work, and the team behind the practice.",
    content: "We started in 2019 with three consultants...", thumbnail_image: "pages/about.jpg", thumbnail_image_alt: "The BWIN team in the Gulshan office",
    status: "published", published_at: "2026-01-08 11:00", is_featured: false,
    created_by: "u-01", updated_by: "u-03", created_at: "2026-01-07 09:30", updated_at: T, deleted_at: null,
    meta_title: "About BWIN Consultants", meta_description: "A consultancy built around operations people, not slide decks.",
    meta_keywords: "about, team, consultancy", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "pg-0003", title: "Skill development", slug: "skill-development", description: "Course catalogue, live classes and certification tracks.",
    content: "Short courses, diploma tracks and live classes...", thumbnail_image: "pages/skill-development.jpg", thumbnail_image_alt: "Trainer with a class",
    status: "published", published_at: "2026-01-10 09:00", is_featured: true,
    created_by: "u-02", updated_by: "u-02", created_at: "2026-01-09 15:20", updated_at: T, deleted_at: null,
    meta_title: "Skill development courses | BWIN", meta_description: "Short courses, diploma tracks and instructor-led classes.",
    meta_keywords: "courses, training, diploma", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "pg-0004", title: "Consultancy", slug: "consultancy", description: "Process audits, compliance reviews and advisory retainers.",
    content: "Two-week diagnostics through to ongoing retainers...", thumbnail_image: "pages/consultancy.jpg", thumbnail_image_alt: "Consultants reviewing a process map",
    status: "published", published_at: "2026-01-10 09:05", is_featured: false,
    created_by: "u-01", updated_by: "u-04", created_at: "2026-01-09 15:40", updated_at: T, deleted_at: null,
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "pg-0005", title: "Business automation", slug: "automation", description: "Workflow build, integration and handover.",
    content: "We build on the tools you already run...", thumbnail_image: "pages/automation.jpg", thumbnail_image_alt: "Workflow diagram on a screen",
    status: "published", published_at: "2026-01-10 09:10", is_featured: true,
    created_by: "u-03", updated_by: "u-03", created_at: "2026-01-09 16:00", updated_at: T, deleted_at: null,
    meta_title: "Business automation | BWIN", meta_description: "Workflow automation built on the tools your team already uses.",
    meta_keywords: "automation, workflow, integration", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "pg-0006", title: "Contact", slug: "contact", description: "Office address, enquiry form and consultant callback request.",
    content: "Gulshan office, Dhaka. We answer enquiries within one working day...", thumbnail_image: "", thumbnail_image_alt: "",
    status: "published", published_at: "2026-01-12 10:00", is_featured: false,
    created_by: "u-01", updated_by: "u-01", created_at: "2026-01-11 12:00", updated_at: T, deleted_at: null,
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "pg-0007", title: "Privacy policy", slug: "privacy-policy", description: "How we handle client and learner data.",
    content: "This policy explains what we collect...", thumbnail_image: "", thumbnail_image_alt: "",
    status: "published", published_at: "2026-02-01 08:00", is_featured: false,
    created_by: "u-04", updated_by: "u-04", created_at: "2026-01-28 17:10", updated_at: T, deleted_at: null,
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "noindex, follow",
  },
  {
    id: "pg-0008", title: "Careers", slug: "careers", description: "Draft — waiting on the two consultant openings to be signed off.",
    content: "We hire people who have run operations, not just studied them...", thumbnail_image: "", thumbnail_image_alt: "",
    status: "draft", published_at: null, is_featured: false,
    created_by: "u-03", updated_by: "u-03", created_at: "2026-08-06 11:25", updated_at: T, deleted_at: null,
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "pg-0009", title: "Automation clinic — September", slug: "automation-clinic-september", description: "Campaign landing page for the Dhaka clinic.",
    content: "A half-day clinic for ops teams...", thumbnail_image: "pages/clinic-campaign.jpg", thumbnail_image_alt: "Workshop room set up for a clinic",
    status: "scheduled", published_at: "2026-09-01 08:00", is_featured: false,
    created_by: "u-03", updated_by: "u-02", created_at: "2026-08-14 09:40", updated_at: T, deleted_at: null,
    meta_title: "Automation clinic — Dhaka, September 2026", meta_description: "A half-day hands-on automation clinic for operations teams.",
    meta_keywords: "clinic, event, automation", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "pg-0010", title: "Webinars", slug: "webinars", description: "Archived — replaced by the events list.",
    content: "Past webinar recordings...", thumbnail_image: "", thumbnail_image_alt: "",
    status: "archived", published_at: "2026-01-20 10:00", is_featured: false,
    created_by: "u-02", updated_by: "u-02", created_at: "2026-01-18 14:00", updated_at: "2026-06-30 09:00", deleted_at: "2026-06-30 09:00",
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "noindex, nofollow",
  },
];
