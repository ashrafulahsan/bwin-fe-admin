// Mock aggregate counts for the admin dashboard, mirroring the shape defined
// in the Claude Design source (BWIN Consultants admin panel/data/admin-dashboard.js).
// Replace with modules/dashboard/services once the backend aggregate endpoints exist.
export const HERO_STATS = [
  { icon: "academic-cap", value: "128", label: "Total courses", action: "Add course", tone: "navy" },
  { icon: "user-group", value: "4,215", label: "Total consultancy service", action: "Add consultancy", tone: "orange" },
  { icon: "currency-dollar", value: "$312K", label: "Total automation service", action: "Add automation", tone: "tan" },
];

export const LMS_CARDS = [
  { icon: "rectangle-stack", value: "42", label: "Total subjects", tone: "navy" },
  { icon: "play-circle", value: "1,860", label: "Total lessons", tone: "navy" },
  { icon: "clipboard-document-check", value: "340", label: "Total quizzes", tone: "navy" },
  { icon: "user-group", value: "4,215", label: "Total students", tone: "orange" },
  { icon: "identification", value: "96", label: "Total instructors", tone: "orange" },
  { icon: "clipboard-document-list", value: "6,530", label: "Total enrollments", tone: "orange" },
  { icon: "banknotes", value: "$184,200", label: "Enrollment revenue", tone: "tan" },
  { icon: "currency-dollar", value: "$312,450", label: "Total revenue", tone: "tan" },
];

export const CMS_CARDS = [
  { icon: "document", value: "64", label: "Total pages", tone: "navy" },
  { icon: "newspaper", value: "312", label: "Total posts", tone: "navy" },
  { icon: "tag", value: "28", label: "Total categories", tone: "navy" },
  { icon: "hashtag", value: "156", label: "Total tags", tone: "navy" },
  { icon: "chat-bubble-left", value: "892", label: "Total comments", tone: "orange" },
  { icon: "photo", value: "1,240", label: "Total media files", tone: "orange" },
  { icon: "users", value: "5,180", label: "Total users", tone: "orange" },
  { icon: "eye", value: "48,900", label: "Total visitors", tone: "tan" },
  { icon: "envelope", value: "214", label: "Contact form submissions", tone: "tan" },
];

export const PENDING_CARDS = [
  { icon: "clock", value: "14", label: "Pending consultancy requests", tone: "orange", badge: "Pending", badgeTone: "warning" },
  { icon: "clock", value: "9", label: "Pending business automation requests", tone: "orange", badge: "Pending", badgeTone: "warning" },
  { icon: "envelope", value: "22", label: "Pending contact messages", tone: "orange", badge: "Pending", badgeTone: "warning" },
  { icon: "chat-bubble-left-ellipsis", value: "47", label: "Pending comments", tone: "orange", badge: "Pending", badgeTone: "warning" },
  { icon: "pencil", value: "11", label: "Draft posts", tone: "neutral", badge: "Draft", badgeTone: "neutral" },
  { icon: "pencil-square", value: "5", label: "Draft pages", tone: "neutral", badge: "Draft", badgeTone: "neutral" },
];

export const RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom" },
];
