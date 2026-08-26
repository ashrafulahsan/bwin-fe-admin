"use client";

import { Badge, Icon, Input, Select, Textarea } from "@/components/ui";
import { ImageDropzone } from "@/components/common";

export default function SettingsRow({ row, columns }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: columns, gap: 16, alignItems: "start", padding: "18px 20px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4, paddingTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>{row.label}</span>
          {row.isSystem && <Badge tone="neutral">System</Badge>}
        </div>
        <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", lineHeight: 1.5 }}>{row.description}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>settings.{row.key}</span>
      </div>

      <div style={{ minWidth: 0 }}>
        {row.isText && <Input value={row.draft} onChange={row.onChange} placeholder={row.placeholder} />}
        {row.isUrl && <Input type="url" value={row.draft} onChange={row.onChange} placeholder="https://" />}
        {row.isTextarea && <Textarea value={row.draft} onChange={row.onChange} rows={3} placeholder={row.placeholder} />}
        {row.isSelect && <Select value={row.draft} onChange={row.onChange} options={row.options} />}
        {row.isImage && (
          <ImageDropzone
            fileRef={row.fileRef}
            onFile={row.onFile}
            onDragOver={row.onDragOver}
            onDragLeave={row.onDragLeave}
            onDrop={row.onDrop}
            dropBorder={row.dropBorder}
            dropBg={row.dropBg}
            previewCss={row.previewCss}
            placeholder=""
            uploadLabel={row.uploadLabel}
            hasImage={row.hasImage}
            onPick={row.onPick}
            onClear={row.onClearImage}
            hint={row.fileHint}
            fit="contain"
            boxWidth={88}
            boxHeight={56}
          />
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, paddingTop: 6 }}>
        <button
          type="button"
          title="Update"
          disabled={row.saveDisabled}
          onClick={row.onSave}
          style={{
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-card)",
            color: row.saveColor,
            cursor: row.saveDisabled ? "default" : "pointer",
            opacity: row.saveDisabled ? 0.45 : 1,
            padding: 0,
          }}
          onMouseEnter={(e) => !row.saveDisabled && (e.currentTarget.style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
        >
          <Icon name="check" size={15} />
        </button>
        <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{row.metaLine}</span>
      </div>
    </div>
  );
}
