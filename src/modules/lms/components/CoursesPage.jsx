"use client";

import { Button } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useCourses } from "../hooks";
import CourseStats from "./CourseStats";
import CourseFiltersBar from "./CourseFiltersBar";
import CourseTable from "./CourseTable";
import CourseDetailModal from "./CourseDetailModal";
import CourseForm from "./CourseForm";

export default function CoursesPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const courses = useCourses();

  const isListView = courses.view === "list";
  const titleSize = isMobile ? "24px" : "32px";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>
        {isListView ? "Skill development" : "Skill development · Courses"}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: titleSize, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {isListView ? "Courses" : courses.editing ? "Edit course" : "New course"}
        </h1>
        <div style={{ flex: 1 }} />
        {isListView ? (
          <>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{courses.resultCount}</span>
            <Button variant="secondary" onClick={courses.exportCsv}>
              Export CSV
            </Button>
            <Button variant="accent" onClick={courses.openNew}>
              New course
            </Button>
          </>
        ) : (
          <>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {courses.editing ? courses.editing.course_code : "new record"}
            </span>
            <Button variant="secondary" onClick={courses.cancelForm}>
              Back to courses
            </Button>
          </>
        )}
      </div>

      {!isListView && (
        <CourseForm
          key={courses.editing?.id ?? "new"}
          editing={courses.editing}
          form={courses.form}
          onFieldChange={courses.setFormField}
          advancedOpen={courses.advancedOpen}
          onToggleAdvanced={courses.toggleAdvanced}
          formError={courses.formError}
          onCancel={courses.cancelForm}
          onSaveDraft={courses.saveDraft}
          onSavePublish={courses.savePublish}
        />
      )}

      {isListView && (
        <>
          <CourseStats stats={courses.stats} />

          {courses.notice && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                background: "var(--state-success-bg)",
                color: "var(--state-success)",
                fontSize: "var(--fs-body-sm)",
              }}
            >
              <span>{courses.notice}</span>
              <span style={{ flex: 1 }} />
              <button onClick={courses.dismissNotice} style={{ border: "none", background: "transparent", color: "inherit", fontSize: 14, cursor: "pointer", lineHeight: 1 }}>
                ✕
              </button>
            </div>
          )}

          <CourseFiltersBar
            search={courses.search}
            onSearch={(e) => courses.setSearch(e.target.value)}
            selects={courses.filterSelects}
            onResetFilters={courses.resetFilters}
            showDeleted={courses.showDeleted}
            onToggleDeleted={courses.toggleShowDeleted}
          />

          <CourseTable
            rows={courses.filtered}
            noResults={courses.noResults}
            darkMode={darkMode}
            onView={courses.onView}
            onEdit={courses.onEdit}
            onDuplicate={courses.onDuplicate}
            onFeature={courses.onFeature}
            onPublish={courses.onPublish}
            onDelete={courses.onDelete}
          />
        </>
      )}

      <CourseDetailModal course={courses.current} onClose={courses.closeDetail} onEdit={courses.editFromDetail} />
    </div>
  );
}
