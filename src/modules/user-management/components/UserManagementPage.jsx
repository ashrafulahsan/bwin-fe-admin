"use client";

import { Button } from "@/components/ui";
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
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {um.filtered.length} of {um.totalCount} users
            </span>
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
          roles={um.form.roles}
          onToggleRole={um.toggleFormRole}
          extrasOpen={um.extrasOpen}
          onToggleExtras={um.toggleExtras}
          formError={um.formError}
          onCancel={um.cancelAdd}
          onSave={um.saveUser}
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
            verifiedFilter={um.verifiedFilter}
            onVerified={(e) => um.setVerifiedFilter(e.target.value)}
            verifiedOptions={um.verifiedOptions}
            loginFilter={um.loginFilter}
            onLogin={(e) => um.setLoginFilter(e.target.value)}
            loginOptions={um.loginOptions}
            onResetFilters={um.resetFilters}
            showDeleted={um.showDeleted}
            onToggleDeleted={um.toggleShowDeleted}
          />

          <UserTable
            rows={um.filtered}
            roleNamesOf={um.roleNamesOf}
            noResults={um.noResults}
            darkMode={darkMode}
            onView={um.openDetail}
            onEdit={um.openDetail}
            onToggleStatus={um.toggleStatus}
            onToggleDeleted={um.toggleDeletedFor}
          />
        </>
      )}

      <UserDetailModal user={um.current} roleNamesOf={um.roleNamesOf} onClose={um.closeDetail} />
    </div>
  );
}
