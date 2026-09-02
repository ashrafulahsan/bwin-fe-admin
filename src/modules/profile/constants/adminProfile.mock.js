// Every field below now has a real backend source: basic info from
// GET/PATCH /auth/me, everything else from GET/PATCH /auth/my-details (the
// user_details table). See BLANK_BASIC and BLANK_DETAILS in
// ../hooks/useProfile.js for the "no data yet" defaults — nothing here is
// mock data any more.
//
// `photo_id` (a media reference, not a plain ID number) is left out of the
// editable groups below: there is no file-upload endpoint yet to produce a
// value for it.

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
      ["date_of_birth", "Date of birth", "date"],
      ["nationality", "Nationality"],
    ],
  },
  {
    title: "Address",
    fields: [
      ["address", "Street address"],
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
      ["years_of_experience", "Years of experience", "number"],
    ],
  },
  {
    title: "Educational",
    fields: [
      ["highest_degree", "Highest degree"],
      ["university", "University"],
      ["graduation_year", "Graduation year", "number"],
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

// Activities now come from GET /my-activity-logs (see useProfile.js) —
// icon/tone per module live there too, next to FAMILIES.
