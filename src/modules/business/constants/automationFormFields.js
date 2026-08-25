// Declarative field-group definitions for the automation create/edit form —
// mirrors the generic renderer in the Claude Design source
// (admin-panel-automations-page.dc.html). Field keys match the DB column
// names (automations table) per this project's data convention.
export const EMPTY_AUTOMATION_FORM = {
  title: "",
  slug: "",
  description: "",
  lists: [""],
  category_id: "",
  image_url: "",
  video_url: "",
  status: "draft",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  meta_robots: "index, follow",
};

// kind: "text" | "select" | "rich" | "list".
// optionsFrom: "categories" | "statuses" | null (static options).
export const AUTOMATION_MAIN_GROUP = {
  title: "Automation",
  fields: [
    { key: "title", label: "Title", kind: "text", placeholder: "Required" },
    { key: "slug", label: "Slug", kind: "text", placeholder: "quote-to-invoice-handoff", hint: "Lowercase letters, numbers and hyphens." },
    { key: "category_id", label: "Category", kind: "select", optionsFrom: "categories" },
    { key: "status", label: "Status", kind: "select", optionsFrom: "statuses" },
    { key: "description", label: "Description", kind: "rich", wide: true },
    { key: "lists", label: "What it does (lists)", kind: "list", wide: true, hint: "Stored as a JSON array in the lists column." },
  ],
};

export const AUTOMATION_ADVANCED_GROUPS = [
  {
    title: "Media",
    fields: [
      { key: "image_url", label: "Image URL", kind: "text", placeholder: "uploads/automation-x.png" },
      { key: "video_url", label: "Video URL", kind: "text" },
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
