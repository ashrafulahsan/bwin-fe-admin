// Ported 1:1 from the design system's components/feedback/Tag.jsx.
export default function Tag({ children, onRemove, style }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 8px 4px 10px",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-sunken)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        fontSize: "var(--fs-body-sm)",
        fontFamily: "var(--font-body)",
        ...style,
      }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 13, lineHeight: 1, padding: 0 }}
        >
          ✕
        </button>
      )}
    </span>
  );
}
