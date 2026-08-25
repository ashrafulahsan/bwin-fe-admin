"use client";

import { Button } from "@/components/ui";

// Small centered confirm dialog (title + message + Cancel/Confirm) — the
// shared shape for "are you sure?" prompts, e.g. deleting a live record.
// Distinct from the bigger detail/form modals (which anchor to the top of
// the viewport); this one centers, since it's just a yes/no decision.
export default function ConfirmDialog({ open, title, message, cancelLabel = "Cancel", confirmLabel = "Confirm", onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 440, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: "22px 24px" }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 17, color: "var(--text-primary)", marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 18 }}>{message}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
