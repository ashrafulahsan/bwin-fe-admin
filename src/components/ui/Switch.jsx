"use client";

// Ported 1:1 from the design system's components/forms/Switch.jsx.
export default function Switch({ checked, onChange, label, disabled, style }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-body)",
        fontSize: "var(--fs-body-md)",
        color: "var(--text-primary)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <span
        onClick={disabled ? undefined : () => onChange && onChange({ target: { checked: !checked } })}
        style={{
          width: 36,
          height: 20,
          borderRadius: "var(--radius-pill)",
          background: checked ? "var(--surface-brand)" : "var(--gray-300)",
          position: "relative",
          transition: "background var(--duration-fast) var(--ease-standard)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--white)",
            transition: "left var(--duration-fast) var(--ease-standard)",
            boxShadow: "var(--shadow-sm)",
          }}
        />
      </span>
      {label}
    </label>
  );
}
