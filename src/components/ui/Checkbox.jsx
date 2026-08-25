"use client";

// Ported 1:1 from the design system's components/forms/Checkbox.jsx.
export default function Checkbox({ label, checked, onChange, disabled, style }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-body)",
        fontSize: "var(--fs-body-md)",
        color: "var(--text-primary)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ display: "none" }} />
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: "var(--radius-xs)",
          border: `1px solid ${checked ? "var(--surface-brand)" : "var(--border-strong)"}`,
          background: checked ? "var(--surface-brand)" : "var(--surface-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background var(--duration-fast) var(--ease-standard)",
          flex: "none",
        }}
      >
        {checked && <span style={{ color: "var(--white)", fontSize: 12, lineHeight: 1 }}>✓</span>}
      </span>
      {label}
    </label>
  );
}
