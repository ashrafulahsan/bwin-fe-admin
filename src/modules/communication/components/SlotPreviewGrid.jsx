"use client";

// Three mini device-mockup buttons — one per placement (pop up / header /
// footer) — used to pick which slot's live preview shows below. Each mockup
// is a tiny fake browser chrome with skeleton content lines and a colored
// band/overlay standing in for whatever's actually live in that slot.
export default function SlotPreviewGrid({ slots }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
      {slots.map((slot) => (
        <button
          key={slot.key}
          type="button"
          onClick={slot.onSelect}
          style={{
            textAlign: "left",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            padding: 12,
            border: `1px solid ${slot.border}`,
            borderRadius: "var(--radius-sm)",
            background: slot.bg,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = slot.border)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, flex: "none", borderRadius: 999, background: slot.dot }} />
            <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>{slot.label}</span>
            <span style={{ fontSize: "var(--fs-caption)", color: slot.stateColor, marginLeft: "auto", fontWeight: "var(--fw-medium)" }}>{slot.stateLabel}</span>
          </div>

          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-xs)", overflow: "hidden", background: "var(--surface-card)" }}>
            <div style={{ height: 12, background: "var(--navy-700)", display: "flex", alignItems: "center", padding: "0 5px", gap: 4 }}>
              <span style={{ width: 12, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.85)" }} />
              <span style={{ width: 7, height: 2, borderRadius: 999, background: "rgba(255,255,255,0.4)" }} />
              <span style={{ width: 7, height: 2, borderRadius: 999, background: "rgba(255,255,255,0.4)" }} />
            </div>
            {slot.showHeaderBar && <div style={{ height: 11, background: slot.bandBg }} />}
            <div style={{ position: "relative", height: 56, padding: "7px 6px", display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ height: 4, width: "52%", borderRadius: 999, background: "var(--gray-200)" }} />
              <span style={{ height: 4, width: "74%", borderRadius: 999, background: "var(--gray-100)" }} />
              <span style={{ height: 4, width: "38%", borderRadius: 999, background: "var(--gray-100)" }} />
              {slot.showPopup && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(10,25,47,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "56%", height: "60%", borderRadius: "var(--radius-xs)", background: slot.bandBg }} />
                </div>
              )}
              {slot.showFooterBar && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 11, background: slot.bandBg }} />}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "var(--fs-caption)", color: slot.titleColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{slot.titleLine}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {slot.metaLine}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
