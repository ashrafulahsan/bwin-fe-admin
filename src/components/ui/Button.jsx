"use client";

// Ported 1:1 from the design system's components/core/Button.jsx (sizes/variants/hover
// backgrounds match exactly — see BWIN Consultants admin panel/_ds/.../_ds_bundle.js).
const SIZES = {
  sm: { padding: "6px 12px", fontSize: "var(--fs-body-sm)", gap: 6, radius: "var(--radius-sm)" },
  md: { padding: "9px 16px", fontSize: "var(--fs-body-md)", gap: 8, radius: "var(--radius-md)" },
  lg: { padding: "12px 22px", fontSize: "var(--fs-body-lg)", gap: 8, radius: "var(--radius-md)" },
};

const VARIANTS = {
  primary: { background: "var(--surface-brand)", color: "var(--text-inverse)", border: "1px solid var(--surface-brand)" },
  accent: { background: "var(--surface-accent)", color: "var(--white)", border: "1px solid var(--surface-accent)" },
  secondary: { background: "var(--surface-card)", color: "var(--text-primary)", border: "1px solid var(--border-strong)" },
  ghost: { background: "transparent", color: "var(--text-primary)", border: "1px solid transparent" },
  danger: { background: "var(--state-error)", color: "var(--white)", border: "1px solid var(--state-error)" },
};

const HOVER_BG = {
  primary: "var(--surface-brand-hover)",
  accent: "var(--surface-accent-hover)",
  secondary: "var(--surface-sunken)",
  ghost: "var(--surface-sunken)",
};

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  icon = null,
  children,
  style,
  onClick,
  type = "button",
  ...rest
}) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: "var(--font-body)",
        fontWeight: "var(--fw-medium)",
        borderRadius: s.radius,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background var(--duration-fast) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard)",
        whiteSpace: "nowrap",
        ...v,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const hoverBg = HOVER_BG[variant];
        if (hoverBg) e.currentTarget.style.background = hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = v.background;
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
