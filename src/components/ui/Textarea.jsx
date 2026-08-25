"use client";

// Ported 1:1 from the design system's components/forms/Textarea.jsx.
export default function Textarea({ label, placeholder, value, onChange, rows = 4, hint, style }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-body)", ...style }}>
      {label && (
        <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>
          {label}
        </span>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: "var(--fs-body-md)",
          fontFamily: "var(--font-body)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-sm)",
          background: "var(--surface-card)",
          color: "var(--text-primary)",
          outline: "none",
          resize: "vertical",
          boxSizing: "border-box",
          transition: "border-color var(--duration-fast) var(--ease-standard)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--border-focus)";
          e.currentTarget.style.boxShadow = "var(--shadow-focus)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border-strong)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {hint && <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{hint}</span>}
    </label>
  );
}
