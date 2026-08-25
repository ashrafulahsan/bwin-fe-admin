// Declarative field-group definitions for the consultancy create/edit form —
// mirrors the generic renderer in the Claude Design source
// (admin-panel-consultancies-page.dc.html). Field keys match the DB column
// names (consultancies table) per this project's data convention.
export const EMPTY_CONSULTANCY_FORM = {
  consultancy_code: "",
  title: "",
  slug: "",
  description: "",
  consultancy_type: "general",
  category_id: "",
  status: "draft",
  sort_order: "0",
  thumbnail: "",
  promo_video_url: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  meta_robots: "index, follow",
};

// kind: "text" | "select" | "textarea" | "rich".
// optionsFrom: "types" | "categories" | "statuses" | null (static options).
export const CONSULTANCY_MAIN_GROUP = {
  title: "Service details",
  fields: [
    { key: "title", label: "Title", kind: "text", placeholder: "Required" },
    { key: "consultancy_code", label: "Consultancy code", kind: "text", placeholder: "BWIN-CS-STR-01" },
    { key: "slug", label: "Slug", kind: "text", placeholder: "growth-strategy-sprint", hint: "Lowercase letters, numbers and hyphens." },
    { key: "consultancy_type", label: "Type", kind: "select", optionsFrom: "types" },
    { key: "category_id", label: "Category", kind: "select", optionsFrom: "categories" },
    { key: "status", label: "Status", kind: "select", optionsFrom: "statuses" },
    { key: "sort_order", label: "Sort order", kind: "text", type: "number" },
    { key: "description", label: "Description", kind: "rich", wide: true, hint: "Required — stored as HTML in the description column." },
  ],
};

export const CONSULTANCY_ADVANCED_GROUPS = [
  {
    title: "Media",
    fields: [
      { key: "thumbnail", label: "Thumbnail path", kind: "text", placeholder: "uploads/consultancy-x.png" },
      { key: "promo_video_url", label: "Promo video URL", kind: "text" },
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
