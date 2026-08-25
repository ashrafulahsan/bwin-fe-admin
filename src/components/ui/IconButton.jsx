"use client";

// Ported 1:1 from the design system's components/core/IconButton.jsx.
export default function IconButton({
  icon,
  size = 36,
  variant = "ghost",
  ariaLabel,
  onClick,
  style,
  ...rest
}) {
  const bg = variant === "ghost" ? "transparent" : variant === "filled" ? "var(--surface-sunken)" : "transparent";
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        border: variant === "outline" ? "1px solid var(--border-strong)" : "1px solid transparent",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        color: "var(--text-secondary)",
        transition: "background var(--duration-fast) var(--ease-standard)",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--surface-sunken)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = bg;
      }}
      {...rest}
    >
      {icon}
    </button>
  );
}
