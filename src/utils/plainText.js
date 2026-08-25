// Strips HTML (from a rich-text field) down to plain text for validation,
// word counts, and read-only previews. Ported from the design source's
// plainText() helper — uses the DOM when available (correct entity
// decoding), falling back to a regex strip for any server-side call.
const NBSP = " ";

export function plainText(html) {
  const withSpacedBreaks = String(html || "").replace(/<(br|\/p|\/li|\/h[1-6])[^>]*>/gi, " $& ");

  if (typeof document !== "undefined") {
    const el = document.createElement("div");
    el.innerHTML = withSpacedBreaks;
    return (el.textContent || "").split(NBSP).join(" ").replace(/\s+/g, " ").trim();
  }

  return withSpacedBreaks
    .replace(/<[^>]*>/g, " ")
    .split(NBSP)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
