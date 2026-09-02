"use client";

import { Button } from "@/components/ui";
import { Pagination } from "@/components/tables";
import { ConfirmDialog } from "@/components/common";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useUserManagement } from "../hooks";
import UserFiltersBar from "./UserFiltersBar";
import UserTable from "./UserTable";
import UserDetailModal from "./UserDetailModal";
import AddUserForm from "./AddUserForm";

export default function UserManagementPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const um = useUserManagement();

  const isListView = um.view === "list";
  const deleteName = um.deleteTarget ? [um.deleteTarget.first_name, um.deleteTarget.last_name].filter(Boolean).join(" ") : "";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", marginBottom: 4 }}>Users</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontWeight: "var(--fw-bold)",
            fontSize: isMobile ? "24px" : "32px",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          User management
        </h1>
        <div style={{ flex: 1 }} />
        {isListView && (
          <>
            {um.meta && (
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {um.meta.total_items} user{um.meta.total_items === 1 ? "" : "s"}
              </span>
            )}
            <Button variant="accent" onClick={um.openAddUser}>
              Add user
            </Button>
          </>
        )}
      </div>

      {!isListView && (
        <AddUserForm
          form={um.form}
          onFieldChange={um.setFormField}
          avatarHint={um.avatarHint}
          onAvatarFile={um.onAvatarFile}
          removeAvatar={um.removeAvatar}
          availableRoles={um.availableRoles}
          onToggleRole={um.toggleFormRole}
          formError={um.formError}
          onCancel={um.cancelAdd}
          onSave={um.saveUser}
          saving={um.savingUser}
        />
      )}

      {isListView && (
        <>
          {um.listNotice && (
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
              <span>{um.listNotice}</span>
              <span style={{ flex: 1 }} />
              <button
                onClick={um.dismissNotice}
                style={{ border: "none", background: "transparent", color: "inherit", fontSize: 14, cursor: "pointer", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
          )}

          <UserFiltersBar
            search={um.search}
            onSearch={(e) => um.setSearch(e.target.value)}
            roleFilter={um.roleFilter}
            onRole={(e) => um.setRoleFilter(e.target.value)}
            roleOptions={um.roleOptions}
            statusFilter={um.statusFilter}
            onStatus={(e) => um.setStatusFilter(e.target.value)}
            statusOptions={um.statusOptions}
            sortBy={um.sortBy}
            onSortBy={(e) => um.setSortBy(e.target.value)}
            sortByOptions={um.sortByOptions}
            sortOrder={um.sortOrder}
            onSortOrder={(e) => um.setSortOrder(e.target.value)}
            sortOrderOptions={um.sortOrderOptions}
            onResetFilters={um.resetFilters}
          />

          {um.loading ? (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-muted)" }}>
              Loading users…
            </div>
          ) : (
            <>
              <UserTable
                rows={um.rows}
                roleNamesOf={um.roleNamesOf}
                noResults={um.noResults}
                darkMode={darkMode}
                onView={um.openDetail}
                onEdit={um.openDetail}
                onToggleStatus={um.toggleStatus}
                onDelete={um.requestDelete}
              />
              <Pagination meta={um.meta} onPrev={um.onPrevPage} onNext={um.onNextPage} />
            </>
          )}
        </>
      )}

      <UserDetailModal user={um.current} detailsLoading={um.detailsLoading} roleNamesOf={um.roleNamesOf} onClose={um.closeDetail} />

      <ConfirmDialog
        open={um.deleteOpen}
        title="Delete this user?"
        message={`"${deleteName}" will be soft-deleted and removed from this list. This can only be undone by an administrator directly, not from this page.`}
        cancelLabel="Keep it"
        confirmLabel={um.deleting ? "Deleting…" : "Delete"}
        onCancel={um.cancelDelete}
        onConfirm={um.confirmDelete}
      />
    </div>
  );
}
