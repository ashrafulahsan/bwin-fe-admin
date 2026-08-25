"use client";

import { Button, Input, Select, Switch, Textarea } from "@/components/ui";

const captionStyle = { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" };

function ImageDropzone({ fileRef, onFile, onDragOver, onDragLeave, onDrop, dropBorder, dropBg, previewCss, placeholder, uploadLabel, hasImage, onPick, onClear, hint }) {
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

export default function ArticleFormModal({
  title,
  subtitle,
  form,
  onContentTab,
  onSeoTab,
  showContentTab,
  showSeoTab,
  contentTabBg,
  contentTabColor,
  seoTabBg,
  seoTabColor,
  onTitle,
  onSlug,
  onCategory,
  categoryOptions,
  onExcerpt,
  excerptCount,
  onContent,
  contentStats,
  featuredFileRef,
  onFeaturedFile,
  onFeaturedDragOver,
  onFeaturedDragLeave,
  onFeaturedDrop,
  featuredDropBorder,
  featuredDropBg,
  featuredPreviewCss,
  featuredPlaceholder,
  featuredUploadLabel,
  hasFeaturedImage,
  pickFeatured,
  clearFeatured,
  featuredHint,
  onImageAlt,
  onAuthor,
  authorOptions,
  onStatus,
  statusOptions,
  onPublishedAt,
  onReadingMinutes,
  onFeatured,
  previewUrl,
  previewTitle,
  previewDescription,
  onMetaTitle,
  metaTitleCount,
  metaTitleColor,
  onMetaDescription,
  metaDescCount,
  metaDescColor,
  onMetaKeywords,
  onMetaRobots,
  robotsOptions,
  onCanonical,
  onOgTitle,
  onOgDescription,
  ogFileRef,
  onOgFile,
  onOgDragOver,
  onOgDragLeave,
  onOgDrop,
  ogDropBorder,
  ogDropBg,
  ogPreviewCss,
  ogPlaceholder,
  ogUploadLabel,
  hasOgImage,
  pickOg,
  clearOg,
  ogHint,
  useFeaturedForOg,
  formError,
  meta,
  saveLabel,
  onClose,
  saveDraft,
  onSubmit,
}) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,25,47,0.45)", zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 760, background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: 18, color: "var(--text-primary)" }}>{title}</div>
            <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{subtitle}</div>
          </div>
          <div style={{ flex: 1, minWidth: 12 }} />
          <div style={{ display: "flex", gap: 2, padding: 3, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-sunken)" }}>
            <button type="button" onClick={showContentTab} style={{ padding: "7px 13px", border: "none", borderRadius: "var(--radius-xs)", background: contentTabBg, color: contentTabColor, fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}>
              Content
            </button>
            <button type="button" onClick={showSeoTab} style={{ padding: "7px 13px", border: "none", borderRadius: "var(--radius-xs)", background: seoTabBg, color: seoTabColor, fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}>
              SEO &amp; social
            </button>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, flex: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-muted)", fontSize: 16, lineHeight: 1, cursor: "pointer" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface-sunken)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ✕
          </button>
        </div>

        {onContentTab && (
          <div style={{ padding: "20px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
              <span style={captionStyle}>Title</span>
              <Input value={form.title} onChange={onTitle} placeholder="e.g. Five signs your invoicing process needs automating" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={captionStyle}>Slug</span>
              <Input value={form.slug} onChange={onSlug} placeholder="five-signs-invoicing-automation" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={captionStyle}>Category</span>
              <Select value={form.blog_category_id} onChange={onCategory} options={categoryOptions} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
              <span style={captionStyle}>Excerpt</span>
              <Textarea value={form.excerpt} onChange={onExcerpt} rows={2} placeholder="One or two sentences shown on the insights index" />
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{excerptCount}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
              <span style={captionStyle}>Content</span>
              <Textarea value={form.content} onChange={onContent} rows={8} placeholder="Write the post body" />
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{contentStats}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
              <span style={captionStyle}>Featured image</span>
              <ImageDropzone
                fileRef={featuredFileRef}
                onFile={onFeaturedFile}
                onDragOver={onFeaturedDragOver}
                onDragLeave={onFeaturedDragLeave}
                onDrop={onFeaturedDrop}
                dropBorder={featuredDropBorder}
                dropBg={featuredDropBg}
                previewCss={featuredPreviewCss}
                placeholder={featuredPlaceholder}
                uploadLabel={featuredUploadLabel}
                hasImage={hasFeaturedImage}
                onPick={pickFeatured}
                onClear={clearFeatured}
                hint={featuredHint}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
              <span style={captionStyle}>Image alt text</span>
              <Input value={form.featured_image_alt} onChange={onImageAlt} placeholder="Describe the image for screen readers" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={captionStyle}>Author</span>
              <Select value={form.author_id} onChange={onAuthor} options={authorOptions} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={captionStyle}>Status</span>
              <Select value={form.status} onChange={onStatus} options={statusOptions} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={captionStyle}>Publish date</span>
              <Input type="datetime-local" value={form.published_at} onChange={onPublishedAt} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={captionStyle}>Reading minutes</span>
              <Input type="number" value={form.reading_minutes} onChange={onReadingMinutes} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, gridColumn: "1/-1", padding: "2px 0 4px" }}>
              <Switch checked={form.is_featured} onChange={onFeatured} />
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)" }}>Feature this post on the insights index</span>
            </div>
          </div>
        )}

        {onSeoTab && (
          <div style={{ padding: "20px 24px 0" }}>
            <div style={{ padding: "14px 16px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-sunken)", marginBottom: 18 }}>
              <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginBottom: 8 }}>Search result preview</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{previewUrl}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: "var(--fw-medium)", color: "var(--navy-700)", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{previewTitle}</div>
              <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 3 }}>{previewDescription}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
                <span style={captionStyle}>Meta title</span>
                <Input value={form.meta_title} onChange={onMetaTitle} placeholder="Falls back to the post title" />
                <span style={{ fontSize: "var(--fs-caption)", color: metaTitleColor }}>{metaTitleCount}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
                <span style={captionStyle}>Meta description</span>
                <Textarea value={form.meta_description} onChange={onMetaDescription} rows={2} placeholder="Falls back to the excerpt" />
                <span style={{ fontSize: "var(--fs-caption)", color: metaDescColor }}>{metaDescCount}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={captionStyle}>Meta keywords</span>
                <Input value={form.meta_keywords} onChange={onMetaKeywords} placeholder="invoicing automation, finance workflow" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={captionStyle}>Robots</span>
                <Select value={form.meta_robots} onChange={onMetaRobots} options={robotsOptions} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
                <span style={captionStyle}>Canonical URL</span>
                <Input value={form.canonical_url} onChange={onCanonical} placeholder="https://bwin.example/insights/..." />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
                <span style={captionStyle}>Open Graph title</span>
                <Input value={form.og_title} onChange={onOgTitle} placeholder="Falls back to the meta title" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
                <span style={captionStyle}>Open Graph description</span>
                <Textarea value={form.og_description} onChange={onOgDescription} rows={2} placeholder="Shown when the post is shared" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1/-1" }}>
                <span style={captionStyle}>Open Graph image</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <ImageDropzone
                    fileRef={ogFileRef}
                    onFile={onOgFile}
                    onDragOver={onOgDragOver}
                    onDragLeave={onOgDragLeave}
                    onDrop={onOgDrop}
                    dropBorder={ogDropBorder}
                    dropBg={ogDropBg}
                    previewCss={ogPreviewCss}
                    placeholder={ogPlaceholder}
                    uploadLabel={ogUploadLabel}
                    hasImage={hasOgImage}
                    onPick={pickOg}
                    onClear={clearOg}
                    hint={ogHint}
                  />
                  <button
                    type="button"
                    onClick={useFeaturedForOg}
                    style={{ alignSelf: "flex-start", padding: "8px 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-card)")}
                  >
                    Use featured image
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {formError && (
          <div style={{ margin: "16px 24px 0", padding: "10px 12px", border: "1px solid var(--red-500)", borderRadius: "var(--radius-sm)", background: "var(--red-100)", fontSize: "var(--fs-body-sm)", color: "var(--red-700)" }}>
            {formError}
          </div>
        )}

        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120, fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{meta}</div>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={saveDraft}>
            Save as draft
          </Button>
          <Button onClick={onSubmit}>{saveLabel}</Button>
        </div>
      </div>
    </div>
  );
}
