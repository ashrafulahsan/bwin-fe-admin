// Mock feed for the header notification bell, mirroring the shape defined in
// the Claude Design source (BWIN Consultants admin panel/data/notifications.js).
// Replace with modules/notifications/services once the notifications API exists.
export const NOTIFICATIONS = [
  {
    id: "NT-2091",
    title: "September cohort schedule is live",
    preview: "The September course calendar is now published. Evening cohorts run Monday and Wednesday…",
    priority: "normal",
    status: "sent",
    sent_at: "2026-08-22 08:00",
  },
  {
    id: "NT-2090",
    title: "Automation “Invoice reminder” failed 3 times",
    preview: "Automation AU-3312 failed three consecutive runs. Last error: SMTP timeout after 30s.",
    priority: "urgent",
    status: "sent",
    sent_at: "2026-08-23 06:14",
  },
  {
    id: "NT-2088",
    title: "12 new consultancy requests this week",
    preview: "Consultancy intake is up 18% week over week — 12 new requests are waiting for triage.",
    priority: "high",
    status: "sent",
    sent_at: "2026-08-23 09:40",
  },
  {
    id: "NT-2084",
    title: "Support ticket #4821 escalated",
    preview: "A billing ticket has been waiting more than 24 hours without a response.",
    priority: "high",
    status: "sent",
    sent_at: "2026-08-24 11:02",
  },
  {
    id: "NT-2079",
    title: "Weekly visitor report is ready",
    preview: "48,900 visitors this week, up 6% from last week. Full breakdown is in Reports.",
    priority: "normal",
    status: "sent",
    sent_at: "2026-08-24 18:15",
  },
];
