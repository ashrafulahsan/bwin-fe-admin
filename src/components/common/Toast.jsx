"use client";

// Bottom-right transient confirmation toast (status changes, saves, exports).
// Render conditionally — `message` falsy means "don't render anything".
export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 70,
        padding: "12px 18px",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--green-500)",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-card)",
        boxShadow: "var(--shadow-lg)",
        fontSize: "var(--fs-body-sm)",
        color: "var(--text-primary)",
      }}
    >
      {message}
    </div>
  );
}
