"use client";

// Ported 1:1 from the design system's components/forms/Input.jsx.
export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  hint,
  icon,
  disabled,
  style,
  ...rest
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-body)", ...style }}>
      {label && (
        <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>
          {label}
        </span>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{ position: "absolute", left: 10, display: "flex", color: "var(--text-muted)" }}>{icon}</span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: "100%",
            padding: icon ? "9px 12px 9px 34px" : "9px 12px",
            fontSize: "var(--fs-body-md)",
            fontFamily: "var(--font-body)",
            border: `1px solid ${error ? "var(--state-error)" : "var(--border-strong)"}`,
            borderRadius: "var(--radius-sm)",
            background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
            color: "var(--text-primary)",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color var(--duration-fast) var(--ease-standard),box-shadow var(--duration-fast) var(--ease-standard)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--border-focus)";
            e.currentTarget.style.boxShadow = "var(--shadow-focus)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "var(--state-error)" : "var(--border-strong)";
            e.currentTarget.style.boxShadow = "none";
          }}
          {...rest}
        />
      </div>
      {(error || hint) && (
        <span style={{ fontSize: "var(--fs-caption)", color: error ? "var(--state-error)" : "var(--text-muted)" }}>
          {error || hint}
        </span>
      )}
    </label>
  );
}
