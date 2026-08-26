"use client";

import { Button } from "@/components/ui";
import { StatCardsGrid, Toast } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { usePages } from "../hooks";
import PageFiltersBar from "./PageFiltersBar";
import PageTable from "./PageTable";
import PageFormModal from "./PageFormModal";

export default function PagesPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const p = usePages();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>CMS</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          Page
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{p.countLine}</span>
        <Button onClick={p.openNew}>New page</Button>
      </div>

      <StatCardsGrid stats={p.statCards} />

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <PageFiltersBar
          search={p.search}
          onSearch={(e) => p.setSearch(e.target.value)}
          statusFilter={p.statusFilter}
          onStatusFilter={(e) => p.setStatusFilter(e.target.value)}
          statusFilterOptions={p.statusFilterOptions}
          authorFilter={p.authorFilter}
          onAuthorFilter={(e) => p.setAuthorFilter(e.target.value)}
          authorFilterOptions={p.authorFilterOptions}
          sort={p.sort}
          onSort={(e) => p.setSort(e.target.value)}
          sortOptions={p.sortOptions}
          featuredOnly={p.featuredOnly}
          toggleFeatured={p.toggleFeatured}
          showDeleted={p.showDeleted}
          toggleDeleted={p.toggleDeleted}
          filtersDirty={p.filtersDirty}
          clearFilters={p.clearFilters}
        />
        <PageTable rows={p.rows} noRows={p.noRows} emptyMessage={p.emptyMessage} />
      </div>

      {p.formOpen && (
        <PageFormModal
          title={p.formTitle}
          subtitle={p.formSubtitle}
          form={p.form}
          onContentTab={p.onContentTab}
          onSeoTab={p.onSeoTab}
          showContentTab={p.showContentTab}
          showSeoTab={p.showSeoTab}
          contentTabBg={p.contentTabBg}
          contentTabColor={p.contentTabColor}
          seoTabBg={p.seoTabBg}
          seoTabColor={p.seoTabColor}
          onTitle={p.onTitle}
          onSlug={p.onSlug}
          urlPreview={p.urlPreview}
          onDescription={p.onDescription}
          descriptionCount={p.descriptionCount}
          onContent={p.onContent}
          contentStats={p.contentStats}
          thumbFileRef={p.thumbFileRef}
          onThumbFile={p.onThumbFile}
          onThumbDragOver={p.onThumbDragOver}
          onThumbDragLeave={p.onThumbDragLeave}
          onThumbDrop={p.onThumbDrop}
          thumbDropBorder={p.thumbDropBorder}
          thumbDropBg={p.thumbDropBg}
          thumbPreviewCss={p.thumbPreviewCss}
          thumbPlaceholder={p.thumbPlaceholder}
          thumbUploadLabel={p.thumbUploadLabel}
          hasThumb={p.hasThumb}
          pickThumb={p.pickThumb}
          clearThumb={p.clearThumb}
          thumbHint={p.thumbHint}
          onThumbAlt={p.onThumbAlt}
          onStatus={p.onStatus}
          statusOptions={p.statusOptions}
          onPublishedAt={p.onPublishedAt}
          onFeatured={p.onFeatured}
          previewUrl={p.previewUrl}
          previewTitle={p.previewTitle}
          previewDescription={p.previewDescription}
          onMetaTitle={p.onMetaTitle}
          metaTitleCount={p.metaTitleCount}
          metaTitleColor={p.metaTitleColor}
          onMetaDescription={p.onMetaDescription}
          metaDescCount={p.metaDescCount}
          metaDescColor={p.metaDescColor}
          onMetaKeywords={p.onMetaKeywords}
          onMetaRobots={p.onMetaRobots}
          robotsOptions={p.robotsOptions}
          onCanonical={p.onCanonical}
          onOgTitle={p.onOgTitle}
          onOgDescription={p.onOgDescription}
          ogFileRef={p.ogFileRef}
          onOgFile={p.onOgFile}
          onOgDragOver={p.onOgDragOver}
          onOgDragLeave={p.onOgDragLeave}
          onOgDrop={p.onOgDrop}
          ogDropBorder={p.ogDropBorder}
          ogDropBg={p.ogDropBg}
          ogPreviewCss={p.ogPreviewCss}
          ogPlaceholder={p.ogPlaceholder}
          ogUploadLabel={p.ogUploadLabel}
          hasOgImage={p.hasOgImage}
          pickOg={p.pickOg}
          clearOg={p.clearOg}
          ogHint={p.ogHint}
          useThumbForOg={p.useThumbForOg}
          formError={p.formError}
          meta={p.formMeta}
          saveLabel={p.saveLabel}
          onClose={p.closeForm}
          saveDraft={p.saveDraft}
          onSubmit={p.save}
        />
      )}

      <Toast message={p.toast} />
    </div>
  );
}
