"use client";

import { Button } from "@/components/ui";
import { StatCardsGrid, Toast } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useArticles } from "../hooks";
import ArticleFiltersBar from "./ArticleFiltersBar";
import ArticleTable from "./ArticleTable";
import ArticleFormModal from "./ArticleFormModal";

export default function ArticlesPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const a = useArticles();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>CMS</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          Article
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{a.countLine}</span>
        <Button onClick={a.openNew}>New post</Button>
      </div>

      <StatCardsGrid stats={a.statCards} />

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <ArticleFiltersBar
          search={a.search}
          onSearch={(e) => a.setSearch(e.target.value)}
          categoryFilter={a.categoryFilter}
          onCategoryFilter={(e) => a.setCategoryFilter(e.target.value)}
          categoryFilterOptions={a.categoryFilterOptions}
          statusFilter={a.statusFilter}
          onStatusFilter={(e) => a.setStatusFilter(e.target.value)}
          statusFilterOptions={a.statusFilterOptions}
          authorFilter={a.authorFilter}
          onAuthorFilter={(e) => a.setAuthorFilter(e.target.value)}
          authorFilterOptions={a.authorFilterOptions}
          sort={a.sort}
          onSort={(e) => a.setSort(e.target.value)}
          sortOptions={a.sortOptions}
          featuredOnly={a.featuredOnly}
          toggleFeatured={a.toggleFeatured}
          showDeleted={a.showDeleted}
          toggleDeleted={a.toggleDeleted}
          filtersDirty={a.filtersDirty}
          clearFilters={a.clearFilters}
        />
        <ArticleTable rows={a.rows} noRows={a.noRows} emptyMessage={a.emptyMessage} />
      </div>

      {a.formOpen && (
        <ArticleFormModal
          title={a.formTitle}
          subtitle={a.formSubtitle}
          form={a.form}
          onContentTab={a.onContentTab}
          onSeoTab={a.onSeoTab}
          showContentTab={a.showContentTab}
          showSeoTab={a.showSeoTab}
          contentTabBg={a.contentTabBg}
          contentTabColor={a.contentTabColor}
          seoTabBg={a.seoTabBg}
          seoTabColor={a.seoTabColor}
          onTitle={a.onTitle}
          onSlug={a.onSlug}
          onCategory={a.onCategory}
          categoryOptions={a.categoryOptions}
          onExcerpt={a.onExcerpt}
          excerptCount={a.excerptCount}
          onContent={a.onContent}
          contentStats={a.contentStats}
          featuredFileRef={a.featuredFileRef}
          onFeaturedFile={a.onFeaturedFile}
          onFeaturedDragOver={a.onFeaturedDragOver}
          onFeaturedDragLeave={a.onFeaturedDragLeave}
          onFeaturedDrop={a.onFeaturedDrop}
          featuredDropBorder={a.featuredDropBorder}
          featuredDropBg={a.featuredDropBg}
          featuredPreviewCss={a.featuredPreviewCss}
          featuredPlaceholder={a.featuredPlaceholder}
          featuredUploadLabel={a.featuredUploadLabel}
          hasFeaturedImage={a.hasFeaturedImage}
          pickFeatured={a.pickFeatured}
          clearFeatured={a.clearFeatured}
          featuredHint={a.featuredHint}
          onImageAlt={a.onImageAlt}
          onAuthor={a.onAuthor}
          authorOptions={a.authorOptions}
          onStatus={a.onStatus}
          statusOptions={a.statusOptions}
          onPublishedAt={a.onPublishedAt}
          onReadingMinutes={a.onReadingMinutes}
          onFeatured={a.onFeatured}
          previewUrl={a.previewUrl}
          previewTitle={a.previewTitle}
          previewDescription={a.previewDescription}
          onMetaTitle={a.onMetaTitle}
          metaTitleCount={a.metaTitleCount}
          metaTitleColor={a.metaTitleColor}
          onMetaDescription={a.onMetaDescription}
          metaDescCount={a.metaDescCount}
          metaDescColor={a.metaDescColor}
          onMetaKeywords={a.onMetaKeywords}
          onMetaRobots={a.onMetaRobots}
          robotsOptions={a.robotsOptions}
          onCanonical={a.onCanonical}
          onOgTitle={a.onOgTitle}
          onOgDescription={a.onOgDescription}
          ogFileRef={a.ogFileRef}
          onOgFile={a.onOgFile}
          onOgDragOver={a.onOgDragOver}
          onOgDragLeave={a.onOgDragLeave}
          onOgDrop={a.onOgDrop}
          ogDropBorder={a.ogDropBorder}
          ogDropBg={a.ogDropBg}
          ogPreviewCss={a.ogPreviewCss}
          ogPlaceholder={a.ogPlaceholder}
          ogUploadLabel={a.ogUploadLabel}
          hasOgImage={a.hasOgImage}
          pickOg={a.pickOg}
          clearOg={a.clearOg}
          ogHint={a.ogHint}
          useFeaturedForOg={a.useFeaturedForOg}
          formError={a.formError}
          meta={a.formMeta}
          saveLabel={a.saveLabel}
          onClose={a.closeForm}
          saveDraft={a.saveDraft}
          onSubmit={a.save}
        />
      )}

      <Toast message={a.toast} />
    </div>
  );
}
