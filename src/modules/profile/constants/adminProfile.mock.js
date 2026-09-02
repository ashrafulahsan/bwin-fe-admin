// public.admin_profiles doesn't exist yet — these fields have no backend
// source, so they stay mock for the Details tab only. Basic info (name,
// email, phone, avatar, bio, language) comes from GET /auth/me, and
// designation/department have no backend source at all — both come out
// blank instead of mock; see BLANK_BASIC in ../hooks/useProfile.js, which is
// why those keys are not listed here.
export const ADMIN_PROFILE = {
  gender: "Female",
  date_of_birth: "1989-03-11",
  nationality: "Bangladeshi",
  photo_id: "BD-PP-4820193",
  street_address: "House 42, Road 11, Banani",
  city: "Dhaka",
  country: "Bangladesh",
  organization: "BWIN Consultants",
  years_of_experience: "11",
  highest_degree: "MBA, Operations management",
  university: "University of Dhaka",
  graduation_year: "2013",
  linkedin_url: "linkedin.com/in/amaraokafor",
  youtube_url: "youtube.com/@bwinconsultants",
  facebook_url: "facebook.com/bwinconsultants",
  website_url: "bwinconsultants.com",
  emergency_contact_name: "Tunde Okafor",
  emergency_contact_phone: "+8801711002244",
};

export const BASIC_FIELDS = [
  { key: "first_name", label: "First name" },
  { key: "last_name", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "language", label: "Language" },
];

export const PROFILE_GROUPS = [
  {
    title: "Personal",
    fields: [
      ["gender", "Gender"],
      ["date_of_birth", "Date of birth"],
      ["nationality", "Nationality"],
      ["photo_id", "NID / Passport / Birth (photo ID)"],
    ],
  },
  {
    title: "Address",
    fields: [
      ["street_address", "Street address"],
      ["city", "City"],
      ["country", "Country"],
    ],
  },
  {
    title: "Professional",
    fields: [
      ["designation", "Designation"],
      ["department", "Department"],
      ["organization", "Organization"],
      ["years_of_experience", "Years of experience"],
    ],
  },
  {
    title: "Educational",
    fields: [
      ["highest_degree", "Highest degree"],
      ["university", "University"],
      ["graduation_year", "Graduation year"],
    ],
  },
  {
    title: "Social",
    fields: [
      ["linkedin_url", "LinkedIn"],
      ["youtube_url", "YouTube"],
      ["facebook_url", "Facebook"],
      ["website_url", "Website"],
    ],
  },
  {
    title: "Emergency",
    fields: [
      ["emergency_contact_name", "Emergency contact name"],
      ["emergency_contact_phone", "Emergency contact phone"],
    ],
  },
];

export const PROFILE_ACTIVITIES = [
  { action: "Updated role permissions", module: "Users", created_at: "2026-08-22 09:12", ip_address: "41.203.12.8", icon: "identification", tone: "navy" },
  { action: "Approved new course submission", module: "Skill development", created_at: "2026-08-21 16:40", ip_address: "41.203.12.8", icon: "academic-cap", tone: "orange" },
  { action: "Exported financial report", module: "Reports", created_at: "2026-08-21 11:05", ip_address: "41.203.12.8", icon: "chart-bar", tone: "tan" },
  { action: 'Published article "Automation in 2026"', module: "CMS", created_at: "2026-08-20 14:22", ip_address: "41.203.12.8", icon: "newspaper", tone: "navy" },
  { action: "Replied to support ticket #482", module: "Communication", created_at: "2026-08-20 09:48", ip_address: "41.203.12.8", icon: "chat-bubble-left-right", tone: "orange" },
  { action: "Signed in", module: "Auth", created_at: "2026-08-20 08:55", ip_address: "41.203.12.8", icon: "user", tone: "neutral" },
];
