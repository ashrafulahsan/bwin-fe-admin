"use client";

// Ported 1:1 from the design system's components/forms/Select.jsx.
export default function Select({ label, value, onChange, options = [], hint, style }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-body)", ...style }}>
      {label && (
        <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>
          {label}
        </span>
      )}
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "9px 32px 9px 12px",
            fontSize: "var(--fs-body-md)",
            fontFamily: "var(--font-body)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-card)",
            color: "var(--text-primary)",
            outline: "none",
            appearance: "none",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--border-focus)";
            e.currentTarget.style.boxShadow = "var(--shadow-focus)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-strong)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--text-muted)",
            fontSize: 11,
          }}
        >
          ▾
        </span>
      </div>
      {hint && <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{hint}</span>}
    </label>
  );
}
