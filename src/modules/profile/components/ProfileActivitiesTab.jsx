"use client";

import { Icon } from "@/components/ui";

export default function ProfileActivitiesTab({ activities }) {
  return (
    <div style={{ padding: "8px 0 4px" }}>
      {activities.map((row, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 32, height: 32, flex: "none", borderRadius: "var(--radius-sm)", background: row.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={row.icon} size={16} style={{ color: row.color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-primary)", fontWeight: "var(--fw-medium)" }}>{row.action}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2 }}>
              {row.module} · {row.ip}
            </div>
          </div>
          <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>{row.timestamp}</div>
        </div>
      ))}
    </div>
  );
}
