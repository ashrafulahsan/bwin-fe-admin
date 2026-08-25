// public.master_cruds, master_crud_fields, master_crud_field_values.
// category_id points at public.categories (see taxonomy.mock.js). In future all data will come from the database.

const T = "2026-08-12 11:40";

// Categories that hold list entries, in display order (id → the category record lives in taxonomy.mock.js).
export const LIST_ENABLED_CATEGORY_IDS = ["c-301", "c-302", "c-303", "c-701", "c-702", "c-703", "c-704"];

export const MASTER_CRUD_FIELDS = [
  // Hero slider
  { id: "f-301a", category_id: "c-301", field_name: "Image", field_type: "image", field_requiredness: true, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-12 10:10", updated_at: T, deleted_at: null },
  { id: "f-301b", category_id: "c-301", field_name: "Button label", field_type: "text", field_requiredness: false, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-12 10:11", updated_at: T, deleted_at: null },
  { id: "f-301c", category_id: "c-301", field_name: "Show on mobile", field_type: "boolean", field_requiredness: false, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-02-04 15:30", updated_at: T, deleted_at: null },

  // Client logos
  { id: "f-302a", category_id: "c-302", field_name: "Logo", field_type: "image", field_requiredness: true, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-01-12 10:20", updated_at: T, deleted_at: null },
  { id: "f-302b", category_id: "c-302", field_name: "Website", field_type: "url", field_requiredness: false, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-01-12 10:21", updated_at: T, deleted_at: null },

  // Testimonials
  { id: "f-303a", category_id: "c-303", field_name: "Quote", field_type: "textarea", field_requiredness: true, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-12 10:30", updated_at: T, deleted_at: null },
  { id: "f-303b", category_id: "c-303", field_name: "Job title", field_type: "text", field_requiredness: false, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-12 10:31", updated_at: T, deleted_at: null },
  { id: "f-303c", category_id: "c-303", field_name: "Rating", field_type: "number", field_requiredness: false, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-18 12:00", updated_at: T, deleted_at: null },

  // FAQ
  { id: "f-701a", category_id: "c-701", field_name: "Answer", field_type: "textarea", field_requiredness: true, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-03-10 09:02", updated_at: T, deleted_at: null },
  { id: "f-701b", category_id: "c-701", field_name: "Group", field_type: "select", field_requiredness: false, status: "active", created_by: "Nadia Rahman", updated_by: "Tanvir Alam", created_at: "2026-03-10 09:03", updated_at: T, deleted_at: null, options: ["Courses", "Billing", "Consultancy", "Automation"] },

  // Event
  { id: "f-702a", category_id: "c-702", field_name: "Organizer", field_type: "text", field_requiredness: true, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-10 09:06", updated_at: T, deleted_at: null },
  { id: "f-702b", category_id: "c-702", field_name: "Event date", field_type: "date", field_requiredness: true, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-10 09:06", updated_at: T, deleted_at: null },
  { id: "f-702c", category_id: "c-702", field_name: "Start time", field_type: "time", field_requiredness: false, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-10 09:07", updated_at: T, deleted_at: null },
  { id: "f-702d", category_id: "c-702", field_name: "Venue", field_type: "text", field_requiredness: false, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-04-02 11:15", updated_at: T, deleted_at: null },
  { id: "f-702e", category_id: "c-702", field_name: "Seats", field_type: "number", field_requiredness: false, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-04-02 11:16", updated_at: T, deleted_at: null },
  { id: "f-702f", category_id: "c-702", field_name: "Registration link", field_type: "url", field_requiredness: false, status: "inactive", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-04-02 11:17", updated_at: T, deleted_at: null },

  // Team member
  { id: "f-703a", category_id: "c-703", field_name: "Role", field_type: "text", field_requiredness: true, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-03-10 09:09", updated_at: T, deleted_at: null },
  { id: "f-703b", category_id: "c-703", field_name: "Photo", field_type: "image", field_requiredness: false, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-03-10 09:09", updated_at: T, deleted_at: null },
  { id: "f-703c", category_id: "c-703", field_name: "LinkedIn", field_type: "url", field_requiredness: false, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-03-10 09:10", updated_at: T, deleted_at: null },
];

export const MASTER_CRUDS = [
  // Hero slider
  { id: "mc-3001", title: "Automate the busywork", slug: "automate-the-busywork", description: "Hero slide one — automation service line", link: "/automation", category_id: "c-301", order: 1, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-01-14 09:10", updated_at: T, deleted_at: null },
  { id: "mc-3002", title: "Train your team in weeks, not months", slug: "train-your-team", description: "Hero slide two — skill development", link: "/skill-development", category_id: "c-301", order: 2, status: "active", created_by: "Nadia Rahman", updated_by: "Tanvir Alam", created_at: "2026-01-14 09:12", updated_at: T, deleted_at: null },
  { id: "mc-3003", title: "A second opinion on your operations", slug: "second-opinion", description: "Hero slide three — consultancy", link: "/consultancy", category_id: "c-301", order: 3, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-01-14 09:14", updated_at: T, deleted_at: null },
  { id: "mc-3004", title: "Ramadan schedule notice", slug: "ramadan-schedule", description: "Seasonal slide — off outside March", link: "/notices/ramadan", category_id: "c-301", order: 4, status: "inactive", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-02-20 14:00", updated_at: T, deleted_at: null },
  { id: "mc-3005", title: "Free automation audit — August", slug: "free-audit-august", description: "Campaign slide, drafted", link: "/campaign/audit", category_id: "c-301", order: 5, status: "draft", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-07-28 16:30", updated_at: T, deleted_at: null },

  // Client logos
  { id: "mc-3101", title: "Meghna Group", slug: "meghna-group", description: "", link: "", category_id: "c-302", order: 1, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-01-15 10:00", updated_at: T, deleted_at: null },
  { id: "mc-3102", title: "Delta Pharma", slug: "delta-pharma", description: "", link: "", category_id: "c-302", order: 2, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-01-15 10:01", updated_at: T, deleted_at: null },
  { id: "mc-3103", title: "Rangs Logistics", slug: "rangs-logistics", description: "", link: "", category_id: "c-302", order: 3, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-01-15 10:02", updated_at: T, deleted_at: null },

  // Testimonials
  { id: "mc-3201", title: "Farhana Islam — Delta Pharma", slug: "farhana-islam", description: "", link: "", category_id: "c-303", order: 1, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-02-02 09:30", updated_at: T, deleted_at: null },
  { id: "mc-3202", title: "Imran Kabir — Rangs Logistics", slug: "imran-kabir", description: "", link: "", category_id: "c-303", order: 2, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-02-02 09:34", updated_at: T, deleted_at: null },

  // FAQ
  { id: "mc-7001", title: "How long does a course take?", slug: "how-long-course", description: "", link: "", category_id: "c-701", order: 1, status: "active", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-11 10:00", updated_at: T, deleted_at: null },
  { id: "mc-7002", title: "Do you invoice monthly?", slug: "invoice-monthly", description: "", link: "", category_id: "c-701", order: 2, status: "active", created_by: "Tanvir Alam", updated_by: "Nadia Rahman", created_at: "2026-03-11 10:02", updated_at: T, deleted_at: null },
  { id: "mc-7003", title: "Can you work with our existing tools?", slug: "existing-tools", description: "", link: "", category_id: "c-701", order: 3, status: "active", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-03-11 10:05", updated_at: T, deleted_at: null },
  { id: "mc-7004", title: "Is there a refund policy?", slug: "refund-policy", description: "Waiting on legal wording", link: "", category_id: "c-701", order: 4, status: "draft", created_by: "Nadia Rahman", updated_by: "Nadia Rahman", created_at: "2026-05-19 13:20", updated_at: T, deleted_at: null },
  { id: "mc-7005", title: "Do you offer weekend batches?", slug: "weekend-batches", description: "Superseded by the schedule page", link: "", category_id: "c-701", order: 5, status: "inactive", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-03-11 10:08", updated_at: "2026-06-20 09:00", deleted_at: "2026-06-20 09:00" },

  // Event
  { id: "mc-7101", title: "Automation clinic — Dhaka", slug: "automation-clinic-dhaka", description: "Half-day hands-on clinic for ops teams", link: "/events/automation-clinic-dhaka", category_id: "c-702", order: 1, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-04-03 09:00", updated_at: T, deleted_at: null },
  { id: "mc-7102", title: "Compliance readiness webinar", slug: "compliance-webinar", description: "Online session with Q&A", link: "/events/compliance-webinar", category_id: "c-702", order: 2, status: "active", created_by: "Sabrina Haque", updated_by: "Tanvir Alam", created_at: "2026-04-03 09:06", updated_at: T, deleted_at: null },
  { id: "mc-7103", title: "Skill development open day", slug: "open-day-september", description: "Campus tour and course previews", link: "/events/open-day", category_id: "c-702", order: 3, status: "draft", created_by: "Tanvir Alam", updated_by: "Tanvir Alam", created_at: "2026-07-15 11:45", updated_at: T, deleted_at: null },

  // Team member
  { id: "mc-7201", title: "Nadia Rahman", slug: "nadia-rahman", description: "", link: "", category_id: "c-703", order: 1, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-03-12 09:00", updated_at: T, deleted_at: null },
  { id: "mc-7202", title: "Tanvir Alam", slug: "tanvir-alam", description: "", link: "", category_id: "c-703", order: 2, status: "active", created_by: "Sabrina Haque", updated_by: "Sabrina Haque", created_at: "2026-03-12 09:02", updated_at: T, deleted_at: null },
];

// master_crud_id + master_crud_field_id → value (text column in the DB)
export const MASTER_CRUD_FIELD_VALUES = [
  { id: "v-0001", master_crud_id: "mc-3001", master_crud_field_id: "f-301a", value: "hero-automation.jpg", created_at: T, updated_at: T },
  { id: "v-0002", master_crud_id: "mc-3001", master_crud_field_id: "f-301b", value: "Start automating", created_at: T, updated_at: T },
  { id: "v-0003", master_crud_id: "mc-3001", master_crud_field_id: "f-301c", value: "true", created_at: T, updated_at: T },
  { id: "v-0004", master_crud_id: "mc-3002", master_crud_field_id: "f-301a", value: "hero-training.jpg", created_at: T, updated_at: T },
  { id: "v-0005", master_crud_id: "mc-3002", master_crud_field_id: "f-301b", value: "See courses", created_at: T, updated_at: T },
  { id: "v-0006", master_crud_id: "mc-3002", master_crud_field_id: "f-301c", value: "true", created_at: T, updated_at: T },
  { id: "v-0007", master_crud_id: "mc-3003", master_crud_field_id: "f-301a", value: "hero-consultancy.jpg", created_at: T, updated_at: T },
  { id: "v-0008", master_crud_id: "mc-3003", master_crud_field_id: "f-301b", value: "Book an audit", created_at: T, updated_at: T },
  { id: "v-0009", master_crud_id: "mc-3003", master_crud_field_id: "f-301c", value: "false", created_at: T, updated_at: T },
  { id: "v-0010", master_crud_id: "mc-3004", master_crud_field_id: "f-301a", value: "hero-ramadan.jpg", created_at: T, updated_at: T },
  { id: "v-0011", master_crud_id: "mc-3005", master_crud_field_id: "f-301b", value: "Claim the audit", created_at: T, updated_at: T },

  { id: "v-0020", master_crud_id: "mc-3101", master_crud_field_id: "f-302a", value: "logo-meghna.svg", created_at: T, updated_at: T },
  { id: "v-0021", master_crud_id: "mc-3101", master_crud_field_id: "f-302b", value: "https://meghnagroup.example", created_at: T, updated_at: T },
  { id: "v-0022", master_crud_id: "mc-3102", master_crud_field_id: "f-302a", value: "logo-delta.svg", created_at: T, updated_at: T },
  { id: "v-0023", master_crud_id: "mc-3103", master_crud_field_id: "f-302a", value: "logo-rangs.svg", created_at: T, updated_at: T },

  { id: "v-0030", master_crud_id: "mc-3201", master_crud_field_id: "f-303a", value: "The invoice workflow used to eat two days a month. It now runs itself.", created_at: T, updated_at: T },
  { id: "v-0031", master_crud_id: "mc-3201", master_crud_field_id: "f-303b", value: "Head of finance", created_at: T, updated_at: T },
  { id: "v-0032", master_crud_id: "mc-3201", master_crud_field_id: "f-303c", value: "5", created_at: T, updated_at: T },
  { id: "v-0033", master_crud_id: "mc-3202", master_crud_field_id: "f-303a", value: "Their team mapped our dispatch process in a week and fixed the worst of it in three.", created_at: T, updated_at: T },
  { id: "v-0034", master_crud_id: "mc-3202", master_crud_field_id: "f-303b", value: "Operations director", created_at: T, updated_at: T },
  { id: "v-0035", master_crud_id: "mc-3202", master_crud_field_id: "f-303c", value: "5", created_at: T, updated_at: T },

  { id: "v-0040", master_crud_id: "mc-7001", master_crud_field_id: "f-701a", value: "Short courses run three to four weeks. Diploma tracks run three to six months depending on the batch.", created_at: T, updated_at: T },
  { id: "v-0041", master_crud_id: "mc-7001", master_crud_field_id: "f-701b", value: "Courses", created_at: T, updated_at: T },
  { id: "v-0042", master_crud_id: "mc-7002", master_crud_field_id: "f-701a", value: "Yes. Retainers are invoiced on the first working day of each month, payable in 15 days.", created_at: T, updated_at: T },
  { id: "v-0043", master_crud_id: "mc-7002", master_crud_field_id: "f-701b", value: "Billing", created_at: T, updated_at: T },
  { id: "v-0044", master_crud_id: "mc-7003", master_crud_field_id: "f-701a", value: "In most cases yes — we build on top of the tools your team already uses rather than replacing them.", created_at: T, updated_at: T },
  { id: "v-0045", master_crud_id: "mc-7003", master_crud_field_id: "f-701b", value: "Automation", created_at: T, updated_at: T },
  { id: "v-0046", master_crud_id: "mc-7004", master_crud_field_id: "f-701b", value: "Billing", created_at: T, updated_at: T },

  { id: "v-0050", master_crud_id: "mc-7101", master_crud_field_id: "f-702a", value: "BWIN Consultants", created_at: T, updated_at: T },
  { id: "v-0051", master_crud_id: "mc-7101", master_crud_field_id: "f-702b", value: "2026-09-12", created_at: T, updated_at: T },
  { id: "v-0052", master_crud_id: "mc-7101", master_crud_field_id: "f-702c", value: "10:00", created_at: T, updated_at: T },
  { id: "v-0053", master_crud_id: "mc-7101", master_crud_field_id: "f-702d", value: "Gulshan office, Dhaka", created_at: T, updated_at: T },
  { id: "v-0054", master_crud_id: "mc-7101", master_crud_field_id: "f-702e", value: "40", created_at: T, updated_at: T },
  { id: "v-0055", master_crud_id: "mc-7102", master_crud_field_id: "f-702a", value: "BWIN Consultants", created_at: T, updated_at: T },
  { id: "v-0056", master_crud_id: "mc-7102", master_crud_field_id: "f-702b", value: "2026-09-25", created_at: T, updated_at: T },
  { id: "v-0057", master_crud_id: "mc-7102", master_crud_field_id: "f-702c", value: "16:30", created_at: T, updated_at: T },
  { id: "v-0058", master_crud_id: "mc-7102", master_crud_field_id: "f-702d", value: "Online — Zoom", created_at: T, updated_at: T },
  { id: "v-0059", master_crud_id: "mc-7102", master_crud_field_id: "f-702e", value: "250", created_at: T, updated_at: T },
  { id: "v-0060", master_crud_id: "mc-7103", master_crud_field_id: "f-702a", value: "BWIN Skill Academy", created_at: T, updated_at: T },
  { id: "v-0061", master_crud_id: "mc-7103", master_crud_field_id: "f-702b", value: "2026-10-04", created_at: T, updated_at: T },

  { id: "v-0070", master_crud_id: "mc-7201", master_crud_field_id: "f-703a", value: "Managing partner", created_at: T, updated_at: T },
  { id: "v-0071", master_crud_id: "mc-7201", master_crud_field_id: "f-703c", value: "https://linkedin.example/in/nadia", created_at: T, updated_at: T },
  { id: "v-0072", master_crud_id: "mc-7202", master_crud_field_id: "f-703a", value: "Head of training", created_at: T, updated_at: T },
];
