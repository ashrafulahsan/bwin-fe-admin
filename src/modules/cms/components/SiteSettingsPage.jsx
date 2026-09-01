"use client";

import { useAppStore } from "@/store/appStore";
import { useSiteSettings } from "../hooks";
import SettingsGroupTabs from "./SettingsGroupTabs";
import SettingsRow from "./SettingsRow";

export default function SiteSettingsPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const s = useSiteSettings();

  const layoutColumns = isMobile ? "1fr" : "220px 1fr";
  const rowColumns = isMobile ? "1fr" : "minmax(0,1fr) minmax(0,1.4fr) 84px";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>CMS</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          Site settings
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{s.countLine}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: layoutColumns, gap: 20, alignItems: "start" }}>
        <SettingsGroupTabs tabs={s.groupTabs} direction={isMobile ? "row" : "column"} />

        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 17, color: "var(--text-primary)" }}>{s.activeGroupLabel}</div>
            <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>{s.activeGroupHint}</div>
          </div>

          {s.activeRows.map((row) => (
            <SettingsRow key={row.id} row={row} columns={rowColumns} />
          ))}
        </div>
      </div>
    </div>
  );
}
