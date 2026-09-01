"use client";

import { Button } from "@/components/ui";
import { ConfirmDialog } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useMenus } from "../hooks";
import CategoryCards from "./CategoryCards";
import MenuTree from "./MenuTree";
import MenuPreviewPanel from "./MenuPreviewPanel";
import MenuFormModal from "./MenuFormModal";

export default function MenusPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const m = useMenus();

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>CMS</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: isMobile ? "24px" : "32px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          Menu
        </h1>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{m.countLine}</span>
        <Button onClick={m.openCreateRoot}>New menu item</Button>
      </div>

      <CategoryCards categories={m.categoryCards} />

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) 320px", gap: 16, alignItems: "start" }}>
        <MenuTree
          search={m.search}
          onSearch={(e) => m.setSearch(e.target.value)}
          expandAll={m.expandAll}
          collapseAll={m.collapseAll}
          showDeleted={m.showDeleted}
          toggleDeleted={m.toggleDeleted}
          dirty={m.dirty}
          revertOrder={m.revertOrder}
          saveOrder={m.saveOrder}
          rows={m.rows}
          noRows={m.noRows}
          emptyMessage={m.emptyMessage}
          rootDropBg={m.rootDropBg}
          onRootDragOver={m.onRootDragOver}
          onRootDrop={m.onRootDrop}
        />

        {!isMobile && (
          <MenuPreviewPanel previewTitle={m.previewTitle} previewSubtitle={m.previewSubtitle} previewTop={m.previewTop} previewTree={m.previewTree} health={m.health} />
        )}
      </div>

      {m.formOpen && (
        <MenuFormModal
          title={m.formTitle}
          subtitle={m.formSubtitle}
          form={m.form}
          onFieldChange={m.setFormField}
          categoryOptions={m.categoryOptions}
          parentOptions={m.parentOptions}
          fileRef={m.fileRef}
          pickImage={m.pickImage}
          onImageFile={m.onImageFile}
          clearImage={m.clearImage}
          hasImage={m.hasImage}
          imagePreviewCss={m.imagePreviewCss}
          imagePlaceholderLabel={m.imagePlaceholderLabel}
          uploadLabel={m.uploadLabel}
          imageHint={m.imageHint}
          imageDropBorder={m.imageDropBorder}
          imageDropBg={m.imageDropBg}
          onImageDragOver={m.onImageDragOver}
          onImageDragLeave={m.onImageDragLeave}
          onImageDrop={m.onImageDrop}
          formError={m.formError}
          submitLabel={m.submitLabel}
          onClose={m.closeForm}
          onSubmit={m.submitForm}
        />
      )}

      <ConfirmDialog
        open={m.trashOpen}
        title="Move to trash?"
        message={m.trashMessage}
        cancelLabel="Keep it"
        confirmLabel="Move to trash"
        onCancel={m.cancelTrash}
        onConfirm={m.confirmTrash}
      />
    </div>
  );
}
