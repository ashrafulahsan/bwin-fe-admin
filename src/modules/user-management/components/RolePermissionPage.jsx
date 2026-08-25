"use client";

import { Button } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useRolePermission } from "../hooks";
import RoleTabs from "./RoleTabs";
import RoleFiltersBar from "./RoleFiltersBar";
import RoleTable from "./RoleTable";
import PermissionTable from "./PermissionTable";
import AssignMatrix from "./AssignMatrix";
import AddRoleForm from "./AddRoleForm";
import RoleDetailModal from "./RoleDetailModal";

export default function RolePermissionPage() {
  const isMobile = useAppStore((state) => state.isMobile);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const rp = useRolePermission();

  const showAddButton = rp.view === "table" && rp.isRolesTab;

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
          Role and permission management
        </h1>
        <div style={{ flex: 1 }} />
        {showAddButton && (
          <Button variant="accent" onClick={rp.openAddRole}>
            Add role
          </Button>
        )}
      </div>

      <RoleTabs tab={rp.tab} view={rp.view} onOpenTab={rp.openTab} onOpenAssign={rp.openAssign} />

      {rp.view === "add" && (
        <AddRoleForm
          form={rp.form}
          onFieldChange={rp.setFormField}
          permissions={rp.permissions}
          resources={rp.resources}
          onTogglePerm={rp.togglePermCode}
          onSelectAll={rp.selectAllPerms}
          onClearAll={rp.clearAllPerms}
          formError={rp.formError}
          onCancel={rp.cancelAdd}
          onSave={rp.saveRole}
        />
      )}

      {rp.view === "assign" && (
        <AssignMatrix
          roles={rp.roles}
          permissions={rp.permissions}
          grants={rp.grants}
          dirty={rp.assignDirty}
          savedNotice={rp.assignSaved}
          onToggle={rp.toggleGrant}
          onSave={rp.saveAssign}
          onRevert={rp.revertAssign}
        />
      )}

      {rp.view === "table" && (
        <>
          <RoleFiltersBar
            isRolesTab={rp.isRolesTab}
            search={rp.search}
            onSearch={(e) => rp.setSearch(e.target.value)}
            permFilter={rp.permFilter}
            onPerm={(e) => rp.setPermFilter(e.target.value)}
            permOptions={rp.permOptions}
            levelFilter={rp.levelFilter}
            onLevel={(e) => rp.setLevelFilter(e.target.value)}
            levelOptions={rp.levelOptions}
            resourceFilter={rp.resourceFilter}
            onResource={(e) => rp.setResourceFilter(e.target.value)}
            resourceOptions={rp.resourceOptions}
            actionFilter={rp.actionFilter}
            onAction={(e) => rp.setActionFilter(e.target.value)}
            actionOptions={rp.actionOptions}
            systemFilter={rp.systemFilter}
            onSystem={(e) => rp.setSystemFilter(e.target.value)}
            systemOptions={rp.systemOptions}
            onResetFilters={rp.resetFilters}
            resultCount={
              rp.isRolesTab
                ? `${rp.filteredRoles.length} of ${rp.roles.length} roles`
                : `${rp.filteredPerms.length} of ${rp.permissions.length} permissions`
            }
          />

          {rp.isRolesTab ? (
            <RoleTable
              rows={rp.filteredRoles}
              grants={rp.grants}
              noResults={rp.noRoleResults}
              darkMode={darkMode}
              onView={(id) => rp.openDetail("role", id)}
              onDuplicate={rp.openDuplicate}
              onDelete={rp.deleteRole}
            />
          ) : (
            <PermissionTable
              rows={rp.filteredPerms}
              grantedTo={rp.grantedTo}
              noResults={rp.noPermResults}
              darkMode={darkMode}
              onView={(id) => rp.openDetail("permission", id)}
            />
          )}
        </>
      )}

      <RoleDetailModal
        role={rp.currentRole}
        permission={rp.currentPerm}
        allPermissions={rp.permissions}
        roleCodes={rp.currentRole ? rp.grants[rp.currentRole.id] || [] : []}
        grantedTo={rp.grantedTo}
        onClose={rp.closeDetail}
      />
    </div>
  );
}
