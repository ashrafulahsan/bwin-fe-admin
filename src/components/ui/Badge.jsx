// Ported 1:1 from the design system's components/feedback/Badge.jsx.
const TONES = {
  neutral: { background: "var(--gray-100)", color: "var(--gray-700)" },
  brand: { background: "var(--navy-50)", color: "var(--navy-700)" },
  success: { background: "var(--state-success-bg)", color: "var(--green-700)" },
  warning: { background: "var(--state-warning-bg)", color: "var(--amber-700)" },
  error: { background: "var(--state-error-bg)", color: "var(--red-700)" },
};

export default function Badge({ children, tone = "neutral", style }) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: "var(--radius-pill)",
        fontSize: "var(--fs-caption)",
        fontWeight: "var(--fw-medium)",
        fontFamily: "var(--font-body)",
        ...t,
        ...style,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: 0.7 }} />
      {children}
    </span>
  );
}
