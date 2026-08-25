// The design system's Badge component has no built-in dark-mode variants —
// every screen that uses it in dark mode overrides `style` per tone. This is
// that override, ported 1:1 from the Claude Design source and shared across
// every table/dashboard page that renders tone-based badges.
export function darkBadgeStyle(tone, darkMode) {
  if (!darkMode) return undefined;
  switch (tone) {
    case "error":
      return { background: "var(--red-700)", color: "var(--red-100)" };
    case "warning":
      return { background: "var(--amber-700)", color: "var(--orange-100)" };
    case "success":
      return { background: "var(--green-700)", color: "var(--green-100)" };
    default:
      return { background: "var(--gray-700)", color: "var(--gray-200)" };
  }
}
