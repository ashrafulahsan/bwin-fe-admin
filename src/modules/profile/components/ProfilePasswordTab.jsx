"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

export default function ProfilePasswordTab() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18, maxWidth: 440 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>Current password</span>
        <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>New password</span>
        <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)" }}>Confirm new password</span>
        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="accent">Update password</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </div>
  );
}
