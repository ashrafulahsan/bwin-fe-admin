"use client";

export default function CourseStats({ stats }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
      {stats.map((st) => (
        <div key={st.label} style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", padding: "14px 16px" }}>
          <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{st.label}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: "var(--fw-semibold)", color: "var(--text-primary)", marginTop: 4 }}>{st.value}</div>
        </div>
      ))}
    </div>
  );
}
