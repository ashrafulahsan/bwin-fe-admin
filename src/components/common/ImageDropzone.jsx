"use client";

import { Button } from "@/components/ui";

// Shared drag-and-drop + click-to-upload image field: a small preview
// box, an Upload/Replace button (opens the hidden file input), an
// optional Remove button, and a hint line. Used for any "attach an
// image" form field (featured/thumbnail images, Open Graph images).
export default function ImageDropzone({ fileRef, onFile, onDragOver, onDragLeave, onDrop, dropBorder, dropBg, previewCss, placeholder, uploadLabel, hasImage, onPick, onClear, hint }) {
  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} style={{ display: "flex", alignItems: "center", gap: 14, padding: 12, border: `1px dashed ${dropBorder}`, borderRadius: "var(--radius-sm)", background: dropBg }}>
      <div
        style={{
          flex: "none",
          width: 96,
          height: 64,
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xs)",
          backgroundColor: "var(--surface-sunken)",
          backgroundImage: previewCss,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          color: "var(--text-muted)",
        }}
      >
        {placeholder}
      </div>
      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onPick}>
            {uploadLabel}
          </Button>
          {hasImage && (
            <button
              type="button"
              onClick={onClear}
              style={{ padding: "8px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--red-700)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--red-100)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
            >
              Remove
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
        </div>
        <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{hint}</div>
      </div>
    </div>
  );
}
