// public.blogs. blog_category_id points at public.categories (post categories, ct-02).
// In future all data will come from the database.

const T = "2026-08-18 09:30";

export const AUTHORS = [
  { id: "u-01", name: "Nadia Rahman", role: "Managing partner" },
  { id: "u-02", name: "Tanvir Alam", role: "Head of training" },
  { id: "u-03", name: "Sabrina Haque", role: "Automation lead" },
  { id: "u-04", name: "Imran Chowdhury", role: "Consultant" },
];

export const BLOG_CATEGORIES = [
  { id: "c-201", name: "Skill development" },
  { id: "c-202", name: "Exam prep" },
  { id: "c-203", name: "Consultancy" },
  { id: "c-204", name: "Compliance" },
  { id: "c-205", name: "Automation" },
  { id: "c-206", name: "Case studies" },
];

export const BLOGS = [
  {
    id: "b-0001", title: "Five signs your invoicing process needs automating", slug: "five-signs-invoicing-automation",
    excerpt: "If your finance team still chases approvals over email, these five symptoms show up first — and each one is fixable in a fortnight.",
    content: "Most finance teams do not set out to build a manual process. It accumulates...",
    featured_image_url: "blog/invoicing-automation.jpg", featured_image_alt: "Finance team reviewing invoices on a laptop",
    blog_category_id: "c-205", status: "published", published_at: "2026-07-02 09:00", is_featured: true, reading_minutes: 6,
    author_id: "u-03", created_by: "u-03", updated_by: "u-03", created_at: "2026-06-28 14:10", updated_at: T, deleted_at: null,
    meta_title: "Five signs your invoicing process needs automating | BWIN", meta_description: "Five symptoms of a manual invoicing process, and what to fix first.",
    meta_keywords: "invoicing automation, finance workflow, process audit", canonical_url: "https://bwin.example/insights/five-signs-invoicing-automation",
    og_title: "Five signs your invoicing process needs automating", og_description: "Each symptom is fixable in a fortnight.", og_image_url: "blog/invoicing-automation-og.jpg", meta_robots: "index, follow",
  },
  {
    id: "b-0002", title: "What a two-week process audit actually looks like", slug: "two-week-process-audit",
    excerpt: "A day-by-day account of how we map a client operation, where the time goes, and what you get at the end.",
    content: "Day one is always interviews...",
    featured_image_url: "blog/process-audit.jpg", featured_image_alt: "Consultant mapping a process on a whiteboard",
    blog_category_id: "c-203", status: "published", published_at: "2026-06-18 10:30", is_featured: true, reading_minutes: 8,
    author_id: "u-01", created_by: "u-01", updated_by: "u-04", created_at: "2026-06-11 09:20", updated_at: T, deleted_at: null,
    meta_title: "What a two-week process audit looks like | BWIN", meta_description: "A day-by-day account of a BWIN process audit and its deliverables.",
    meta_keywords: "process audit, operations consulting", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "b-0003", title: "Rangs Logistics cut dispatch time by 41%", slug: "rangs-logistics-dispatch",
    excerpt: "Three weeks of work on one workflow removed most of the waiting from a dispatch desk handling 600 consignments a day.",
    content: "The dispatch desk was not slow because people were slow...",
    featured_image_url: "blog/rangs-case-study.jpg", featured_image_alt: "Logistics dispatch desk",
    blog_category_id: "c-206", status: "published", published_at: "2026-05-29 08:00", is_featured: false, reading_minutes: 5,
    author_id: "u-04", created_by: "u-04", updated_by: "u-04", created_at: "2026-05-22 11:45", updated_at: T, deleted_at: null,
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "b-0004", title: "How to pick a diploma track that your employer will pay for", slug: "pick-a-diploma-track",
    excerpt: "Sponsorship decisions come down to three questions. Answer them before you apply and the conversation gets much shorter.",
    content: "Employers rarely refuse training outright...",
    featured_image_url: "blog/diploma-track.jpg", featured_image_alt: "Student reviewing a course catalogue",
    blog_category_id: "c-201", status: "published", published_at: "2026-05-14 12:00", is_featured: false, reading_minutes: 4,
    author_id: "u-02", created_by: "u-02", updated_by: "u-02", created_at: "2026-05-10 16:30", updated_at: T, deleted_at: null,
    meta_title: "", meta_description: "Three questions to answer before asking your employer to sponsor a diploma track.",
    meta_keywords: "diploma, sponsorship, skill development", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "b-0005", title: "The compliance checklist we run before every audit", slug: "compliance-checklist",
    excerpt: "Fourteen items, most of which take an afternoon. Skipping them is what turns a review into a scramble.",
    content: "Start with the register...",
    featured_image_url: "blog/compliance-checklist.jpg", featured_image_alt: "Checklist on a clipboard",
    blog_category_id: "c-204", status: "scheduled", published_at: "2026-09-01 09:00", is_featured: false, reading_minutes: 7,
    author_id: "u-01", created_by: "u-01", updated_by: "u-01", created_at: "2026-08-10 10:05", updated_at: T, deleted_at: null,
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "b-0006", title: "CRM automation without replacing your CRM", slug: "crm-automation-without-replacing",
    excerpt: "Draft — needs the Meghna Group numbers before it goes out.",
    content: "Ripping out a CRM is the most expensive way to fix a reporting problem...",
    featured_image_url: "", featured_image_alt: "",
    blog_category_id: "c-205", status: "draft", published_at: null, is_featured: false, reading_minutes: 5,
    author_id: "u-03", created_by: "u-03", updated_by: "u-03", created_at: "2026-08-04 15:20", updated_at: T, deleted_at: null,
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "b-0007", title: "Exam week: what our top scorers do differently", slug: "exam-week-top-scorers",
    excerpt: "We asked forty certificate holders how they prepared. The answers were duller — and more useful — than expected.",
    content: "Nobody credited a last-minute all-nighter...",
    featured_image_url: "blog/exam-week.jpg", featured_image_alt: "Students in an exam hall",
    blog_category_id: "c-202", status: "draft", published_at: null, is_featured: false, reading_minutes: 3,
    author_id: "u-02", created_by: "u-02", updated_by: "u-02", created_at: "2026-08-15 09:10", updated_at: T, deleted_at: null,
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "noindex, follow",
  },
  {
    id: "b-0008", title: "Meghna Group: one dashboard for eleven factories", slug: "meghna-group-dashboard",
    excerpt: "Reporting that took four days a month now lands every Monday morning without anyone touching a spreadsheet.",
    content: "Eleven factories, eleven reporting formats...",
    featured_image_url: "blog/meghna-dashboard.jpg", featured_image_alt: "Operations dashboard on a wall screen",
    blog_category_id: "c-206", status: "published", published_at: "2026-04-22 08:30", is_featured: false, reading_minutes: 6,
    author_id: "u-04", created_by: "u-04", updated_by: "u-01", created_at: "2026-04-14 13:00", updated_at: T, deleted_at: null,
    meta_title: "Meghna Group case study | BWIN", meta_description: "How eleven factories moved to a single weekly operations dashboard.",
    meta_keywords: "case study, reporting, manufacturing", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "index, follow",
  },
  {
    id: "b-0009", title: "Webinar recap: automation for small teams", slug: "webinar-recap-small-teams",
    excerpt: "Archived — superseded by the events page.",
    content: "Thanks to everyone who joined...",
    featured_image_url: "", featured_image_alt: "",
    blog_category_id: "c-205", status: "archived", published_at: "2026-02-11 10:00", is_featured: false, reading_minutes: 2,
    author_id: "u-03", created_by: "u-03", updated_by: "u-03", created_at: "2026-02-09 17:40", updated_at: "2026-06-25 10:00", deleted_at: "2026-06-25 10:00",
    meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "", meta_robots: "noindex, nofollow",
  },
];
