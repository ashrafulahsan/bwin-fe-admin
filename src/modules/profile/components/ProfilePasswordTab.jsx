"use client";

import { Button, Checkbox, Input } from "@/components/ui";
import { usePasswordChange } from "../hooks";

export default function ProfilePasswordTab() {
  const p = usePasswordChange();

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18, maxWidth: 440 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>Current password</span>
        <Input type="password" value={p.current} onChange={p.onCurrentChange} placeholder="Enter current password" autoComplete="current-password" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>New password</span>
        <Input type="password" value={p.next} onChange={p.onNextChange} placeholder="At least 8 characters" autoComplete="new-password" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>Confirm new password</span>
        <Input type="password" value={p.confirm} onChange={p.onConfirmChange} placeholder="Repeat new password" autoComplete="new-password" />
      </div>

      <Checkbox
        label="Sign out of all other sessions"
        checked={p.signOutOtherSessions}
        onChange={p.onSignOutOtherSessionsChange}
      />
      <span style={{ marginTop: -12, fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
        Ends every other device and browser signed in to this account. This one stays signed in either way.
      </span>

      {p.formError && (
        <div style={{ padding: "10px 12px", border: "1px solid var(--state-error)", borderRadius: "var(--radius-sm)", background: "var(--state-error-bg)", fontSize: "var(--fs-body-sm)", color: "var(--state-error)" }}>
          {p.formError}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="accent" onClick={p.submit} disabled={p.submitting}>
          {p.submitting ? "Updating…" : "Update password"}
        </Button>
        <Button variant="secondary" onClick={p.cancel} disabled={p.submitting}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
