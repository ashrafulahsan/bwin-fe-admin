// Declarative field-group definitions for the course create/edit form —
// mirrors the generic {title, fields[]} renderer in the Claude Design source
// (admin-panel-courses-page.dc.html). Field keys match the DB column names
// (courses table) per this project's data convention.
export const EMPTY_COURSE_FORM = {
  course_code: "",
  title: "",
  slug: "",
  short_description: "",
  description: "",
  learning_outcomes: "",
  requirements: "",
  target_audience: "",
  category_id: "",
  level: "beginner",
  language: "english",
  course_type: "",
  delivery_mode: "",
  thumbnail: "",
  cover_image: "",
  promo_video_url: "",
  intro_video_url: "",
  duration_hours: "0",
  duration_minutes: "0",
  total_modules: "0",
  total_lessons: "0",
  total_quizzes: "0",
  total_assignments: "0",
  total_resources: "0",
  passing_score: "60",
  certificate_enabled: false,
  certificate_template_id: "",
  max_attempts: "",
  seat_limit: "",
  price: "0.00",
  discount_price: "",
  currency: "USD",
  enrollment_start_date: "",
  enrollment_end_date: "",
  course_start_date: "",
  course_end_date: "",
  status: "draft",
  visibility: "public",
  featured: false,
  allow_reviews: true,
  allow_discussion: true,
  sort_order: "0",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  meta_robots: "index, follow",
};

// kind: "text" | "select" | "textarea" | "bool" | "rich".
// optionsFrom: "categories" | "courseTypes" | "deliveryModes" | "levels" | "languages" | "statuses" | "visibilities" | null (static options).
export const COURSE_FORM_GROUPS = [
  {
    title: "Identity",
    fields: [
      { key: "title", label: "Title", kind: "text", placeholder: "Required — shown everywhere" },
      { key: "course_code", label: "Course code", kind: "text", placeholder: "BWIN-AUT-101" },
      { key: "slug", label: "Slug", kind: "text", placeholder: "workflow-automation-foundations", hint: "Lowercase letters, numbers and hyphens." },
      { key: "status", label: "Status", kind: "select", optionsFrom: "statuses" },
      { key: "short_description", label: "Short description", kind: "textarea", rows: 3, placeholder: "One or two plain sentences for cards and listings." },
      { key: "description", label: "Full description", kind: "rich", wide: true, hint: "Rich text — bold, headings, lists and links are stored as HTML in the description column." },
    ],
  },
  {
    title: "Classification",
    fields: [
      { key: "category_id", label: "Category", kind: "select", optionsFrom: "categories" },
      { key: "course_type", label: "Course type", kind: "select", optionsFrom: "courseTypes" },
      { key: "delivery_mode", label: "Delivery mode", kind: "select", optionsFrom: "deliveryModes" },
      { key: "level", label: "Level", kind: "select", optionsFrom: "levels" },
      { key: "language", label: "Language", kind: "select", optionsFrom: "languages" },
      { key: "sort_order", label: "Sort order", kind: "text", type: "number" },
    ],
  },
  {
    title: "What learners get",
    fields: [
      { key: "learning_outcomes", label: "Learning outcomes", kind: "textarea", rows: 4, placeholder: "One outcome per line", hint: "Stored as JSON array." },
      { key: "requirements", label: "Requirements", kind: "textarea", rows: 3, placeholder: "One requirement per line", hint: "Stored as JSON array." },
      { key: "target_audience", label: "Target audience", kind: "textarea", rows: 3, placeholder: "One audience per line", hint: "Stored as JSON array." },
      { key: "duration_hours", label: "Duration hours", kind: "text", type: "number" },
      { key: "duration_minutes", label: "Duration minutes", kind: "text", type: "number" },
    ],
  },
  {
    title: "Assessment and certificate",
    fields: [
      { key: "passing_score", label: "Passing score (%)", kind: "text", type: "number" },
      { key: "max_attempts", label: "Max attempts", kind: "text", type: "number", placeholder: "Blank = unlimited" },
      { key: "certificate_enabled", label: "Issue a certificate on completion", kind: "bool" },
      { key: "certificate_template_id", label: "Certificate template id", kind: "text", placeholder: "tpl-0001" },
    ],
  },
  {
    title: "Pricing and enrollment",
    fields: [
      { key: "price", label: "Price", kind: "text", type: "number", placeholder: "0.00", hint: "Set 0 for a free course." },
      { key: "discount_price", label: "Discount price", kind: "text", type: "number", placeholder: "Blank = no discount" },
      { key: "currency", label: "Currency", kind: "select", options: [{ value: "USD", label: "USD" }, { value: "BDT", label: "BDT" }, { value: "EUR", label: "EUR" }] },
      { key: "seat_limit", label: "Seat limit", kind: "text", type: "number", placeholder: "Blank = unlimited" },
      { key: "enrollment_start_date", label: "Enrollment opens", kind: "text", type: "datetime-local" },
      { key: "enrollment_end_date", label: "Enrollment closes", kind: "text", type: "datetime-local" },
      { key: "course_start_date", label: "Course starts", kind: "text", type: "datetime-local" },
      { key: "course_end_date", label: "Course ends", kind: "text", type: "datetime-local" },
    ],
  },
  {
    title: "Visibility and engagement",
    fields: [
      { key: "visibility", label: "Visibility", kind: "select", optionsFrom: "visibilities" },
      { key: "featured", label: "Feature on the catalogue", kind: "bool" },
      { key: "allow_reviews", label: "Allow reviews", kind: "bool" },
      { key: "allow_discussion", label: "Allow discussion", kind: "bool" },
    ],
  },
];

export const COURSE_ADVANCED_GROUPS = [
  {
    title: "Media",
    fields: [
      { key: "thumbnail", label: "Thumbnail path", kind: "text", placeholder: "uploads/course-x.png" },
      { key: "cover_image", label: "Cover image path", kind: "text" },
      { key: "promo_video_url", label: "Promo video URL", kind: "text" },
      { key: "intro_video_url", label: "Intro video URL", kind: "text" },
    ],
  },
  {
    title: "Content counts",
    fields: [
      { key: "total_modules", label: "Modules", kind: "text", type: "number" },
      { key: "total_lessons", label: "Lessons", kind: "text", type: "number" },
      { key: "total_quizzes", label: "Quizzes", kind: "text", type: "number" },
      { key: "total_assignments", label: "Assignments", kind: "text", type: "number" },
      { key: "total_resources", label: "Resources", kind: "text", type: "number" },
    ],
  },
  {
    title: "SEO",
    fields: [
      { key: "meta_title", label: "Meta title", kind: "text", wide: true },
      { key: "meta_description", label: "Meta description", kind: "textarea", rows: 2 },
      { key: "meta_keywords", label: "Meta keywords", kind: "text" },
      {
        key: "meta_robots",
        label: "Meta robots",
        kind: "select",
        options: [
          { value: "index, follow", label: "index, follow" },
          { value: "noindex, nofollow", label: "noindex, nofollow" },
          { value: "index, nofollow", label: "index, nofollow" },
        ],
      },
      { key: "canonical_url", label: "Canonical URL", kind: "text", wide: true },
      { key: "og_title", label: "OG title", kind: "text" },
      { key: "og_description", label: "OG description", kind: "textarea", rows: 2 },
      { key: "og_image_url", label: "OG image URL", kind: "text" },
    ],
  },
];
