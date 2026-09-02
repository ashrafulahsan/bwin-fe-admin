// Declarative field-group definitions for the "New user" form — mirrors the
// generic {title, fields[]} renderer in the Claude Design source
// (admin-panel-user-management.dc.html) so the form stays one small
// component instead of ~30 hand-written fields. Field keys match the DB
// column names (users / user_details) per this project's data convention.
export const EMPTY_USER_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  avatar_url: "",
  password_hash: "",
  status: "pending",
  language: "en",
  bio: "",
  gender: "",
  date_of_birth: "",
  nationality: "",
  address: "",
  city: "",
  country: "",
  designation: "",
  department: "",
  organization: "",
  years_of_experience: "",
  highest_degree: "",
  university: "",
  graduation_year: "",
  linkedin_url: "",
  youtube_url: "",
  facebook_url: "",
  website_url: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  notes: "",
  role_ids: [],
};

const GENDER_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Other", label: "Other" },
];

// kind: "text" | "select" | "textarea". optionsFrom: "statuses" | "languages" | null (static options).
export const USER_FORM_GROUPS = [
  {
    title: "Basic (users)",
    fields: [
      { key: "first_name", label: "First name", kind: "text", placeholder: "Required" },
      { key: "last_name", label: "Last name", kind: "text" },
      { key: "email", label: "Email", kind: "text", type: "email", placeholder: "name@bwin.com", hint: "Email or phone is required." },
      { key: "phone", label: "Phone", kind: "text", placeholder: "+8801…" },
      { key: "password_hash", label: "Password", kind: "text", type: "password", placeholder: "At least 8 characters", hint: "Stored as password_hash. Leave blank for social-only sign-in." },
      { key: "status", label: "Status", kind: "select", optionsFrom: "statuses" },
      { key: "language", label: "Language", kind: "select", optionsFrom: "languages" },
      { key: "bio", label: "Bio", kind: "textarea", placeholder: "Short internal description", wide: true },
    ],
  },
  {
    title: "Personal (user_details)",
    fields: [
      { key: "gender", label: "Gender", kind: "select", options: GENDER_OPTIONS },
      { key: "date_of_birth", label: "Date of birth", kind: "text", type: "date" },
      { key: "nationality", label: "Nationality", kind: "text" },
    ],
  },
  {
    title: "Address",
    fields: [
      { key: "address", label: "Street address", kind: "textarea", wide: true },
      { key: "city", label: "City", kind: "text" },
      { key: "country", label: "Country", kind: "text" },
    ],
  },
  {
    title: "Professional",
    fields: [
      { key: "designation", label: "Designation", kind: "text" },
      { key: "department", label: "Department", kind: "text" },
      { key: "organization", label: "Organization", kind: "text" },
      { key: "years_of_experience", label: "Years of experience", kind: "text", type: "number" },
    ],
  },
  {
    title: "Educational",
    fields: [
      { key: "highest_degree", label: "Highest degree", kind: "text" },
      { key: "university", label: "University", kind: "text" },
      { key: "graduation_year", label: "Graduation year", kind: "text", type: "number" },
    ],
  },
  {
    title: "Social",
    fields: [
      { key: "linkedin_url", label: "LinkedIn URL", kind: "text" },
      { key: "youtube_url", label: "YouTube URL", kind: "text" },
      { key: "facebook_url", label: "Facebook URL", kind: "text" },
      { key: "website_url", label: "Website URL", kind: "text" },
    ],
  },
  {
    title: "Emergency",
    fields: [
      { key: "emergency_contact_name", label: "Emergency contact name", kind: "text" },
      { key: "emergency_contact_phone", label: "Emergency contact phone", kind: "text" },
      { key: "notes", label: "Notes", kind: "textarea", wide: true },
    ],
  },
];
