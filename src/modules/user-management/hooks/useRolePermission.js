"use client";

import { useMemo, useState } from "react";
import { ROLES, PERMISSIONS, RESOURCES } from "../constants/roles.mock";
import { slugify } from "@/utils/slugify";
import { validateRoleForm } from "../validation/validateRoleForm";

const EMPTY_ROLE_FORM = { name: "", slug: "", level: "30", description: "", codes: [] };

const buildGrants = (roles) => Object.fromEntries(roles.map((r) => [r.id, [...r.permission_codes]]));
const capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);

// Mirrors the state machine in the Claude Design source
// (admin-panel-role-permission.dc.html): three tabs (Roles / Permissions /
// Assign permissions), a "New role" form, and a shared detail modal. Backed
// by in-memory mock data (constants/roles.mock.js) — swap the setRoles /
// setGrants mutations for modules/user-management/services once the
// roles/permissions API exists.
//
// One deliberate correction vs. the source: its "Add permission" button (on
// the Permissions tab) opened the role-creation form under a mismatched
// label — there is no permission-creation UI in the design to replicate, so
// here the "Add role" button only appears on the Roles tab.
export function useRolePermission() {
  const [roles, setRoles] = useState(ROLES);
  const [grants, setGrants] = useState(() => buildGrants(ROLES));
  const [savedGrants, setSavedGrants] = useState(() => buildGrants(ROLES));
  const [assignSaved, setAssignSaved] = useState(null);

  const [tab, setTab] = useState("roles"); // "roles" | "permissions"
  const [view, setView] = useState("table"); // "table" | "add" | "assign"
  const [search, setSearch] = useState("");
  const [permFilter, setPermFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [systemFilter, setSystemFilter] = useState("all");

  const [detailKind, setDetailKind] = useState(null); // "role" | "permission" | null
  const [detailId, setDetailId] = useState(null);

  const [form, setForm] = useState(EMPTY_ROLE_FORM);
  const [formError, setFormError] = useState(null);

  const isRolesTab = tab === "roles";

  const filteredRoles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roles.filter((r) => {
      if (permFilter !== "all" && !(grants[r.id] || []).includes(permFilter)) return false;
      if (levelFilter === "high" && r.level < 60) return false;
      if (levelFilter === "mid" && (r.level < 30 || r.level >= 60)) return false;
      if (levelFilter === "low" && r.level >= 30) return false;
      if (systemFilter === "system" && !r.is_system) return false;
      if (systemFilter === "custom" && r.is_system) return false;
      if (q && !`${r.name} ${r.slug} ${r.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [roles, grants, search, permFilter, levelFilter, systemFilter]);

  const filteredPerms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PERMISSIONS.filter((p) => {
      if (resourceFilter !== "all" && p.resource !== resourceFilter) return false;
      if (actionFilter !== "all" && p.action !== actionFilter) return false;
      if (systemFilter === "system" && !p.is_system) return false;
      if (systemFilter === "custom" && p.is_system) return false;
      if (q && !`${p.code} ${p.name} ${p.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [resourceFilter, actionFilter, systemFilter, search]);

  const grantedTo = (code) => roles.filter((r) => (grants[r.id] || []).includes(code)).map((r) => r.name);

  const openTab = (key) => {
    setTab(key);
    setView("table");
    setSearch("");
  };
  const openAssign = () => setView("assign");

  const openAddRole = () => {
    setView("add");
    setFormError(null);
    setForm(EMPTY_ROLE_FORM);
  };
  const cancelAdd = () => {
    setView("table");
    setFormError(null);
  };

  const openDuplicate = (role) => {
    setView("add");
    setFormError(null);
    setForm({
      name: `${role.name} (copy)`,
      slug: slugify(`${role.name}-copy`),
      level: String(role.level),
      description: role.description,
      codes: [...(grants[role.id] || [])],
    });
  };

  const setFormField = (key, value) => {
    if (key === "name") {
      const autoSlug = slugify(form.name) === form.slug;
      setForm((f) => ({ ...f, name: value, slug: autoSlug ? slugify(value) : f.slug }));
      return;
    }
    if (key === "slug") {
      setForm((f) => ({ ...f, slug: slugify(value) }));
      return;
    }
    setForm((f) => ({ ...f, [key]: value }));
  };

  const togglePermCode = (code) =>
    setForm((f) => ({ ...f, codes: f.codes.includes(code) ? f.codes.filter((c) => c !== code) : f.codes.concat(code) }));
  const selectAllPerms = () => setForm((f) => ({ ...f, codes: PERMISSIONS.map((p) => p.code) }));
  const clearAllPerms = () => setForm((f) => ({ ...f, codes: [] }));

  const saveRole = () => {
    const error = validateRoleForm(form, roles);
    if (error) {
      setFormError(error);
      return;
    }
    const name = form.name.trim();
    const newRole = {
      id: `r-new-${roles.length + 1}`,
      name,
      slug: form.slug || slugify(name),
      level: Number(form.level),
      is_system: false,
      description: form.description.trim() || "No description yet.",
      users_count: 0,
      created_at: new Date().toISOString().slice(0, 10),
      permission_codes: [...form.codes],
    };
    setRoles((prev) => prev.concat(newRole));
    setGrants((prev) => ({ ...prev, [newRole.id]: [...form.codes] }));
    setSavedGrants((prev) => ({ ...prev, [newRole.id]: [...form.codes] }));
    setView("table");
    setFormError(null);
  };

  const deleteRole = (roleId) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId || r.is_system));
  };

  const toggleGrant = (roleId, code) => {
    setGrants((prev) => {
      const current = prev[roleId] || [];
      const next = current.includes(code) ? current.filter((c) => c !== code) : current.concat(code);
      return { ...prev, [roleId]: next };
    });
    setAssignSaved(null);
  };

  const assignDirty = JSON.stringify(grants) !== JSON.stringify(savedGrants);
  const saveAssign = () => {
    setSavedGrants(grants);
    setAssignSaved("Permission assignments saved.");
  };
  const revertAssign = () => {
    setGrants(savedGrants);
    setAssignSaved(null);
  };

  const openDetail = (kind, id) => {
    setDetailKind(kind);
    setDetailId(id);
  };
  const closeDetail = () => {
    setDetailKind(null);
    setDetailId(null);
  };

  const currentRole = detailKind === "role" ? roles.find((r) => r.id === detailId) || null : null;
  const currentPerm = detailKind === "permission" ? PERMISSIONS.find((p) => p.id === detailId) || null : null;

  const actions = useMemo(() => [...new Set(PERMISSIONS.map((p) => p.action))], []);
  const opts = (values, allLabel) => [{ value: "all", label: allLabel }].concat(values.map((v) => ({ value: v, label: capitalize(v) })));

  return {
    // tabs / view
    tab,
    isRolesTab,
    view,
    openTab,
    openAssign,

    // roles table
    roles,
    filteredRoles,
    noRoleResults: roles.length > 0 && filteredRoles.length === 0,
    grants,
    openAddRole,
    openDuplicate,
    deleteRole,

    // permissions table
    permissions: PERMISSIONS,
    filteredPerms,
    noPermResults: PERMISSIONS.length > 0 && filteredPerms.length === 0,
    grantedTo,

    // filters
    search,
    setSearch,
    permFilter,
    setPermFilter,
    levelFilter,
    setLevelFilter,
    resourceFilter,
    setResourceFilter,
    actionFilter,
    setActionFilter,
    systemFilter,
    setSystemFilter,
    resetFilters: () => {
      setSearch("");
      setPermFilter("all");
      setLevelFilter("all");
      setResourceFilter("all");
      setActionFilter("all");
      setSystemFilter("all");
    },
    permOptions: [{ value: "all", label: "Any permission" }].concat(PERMISSIONS.map((p) => ({ value: p.code, label: p.code }))),
    levelOptions: [
      { value: "all", label: "Any level" },
      { value: "high", label: "High (60–100)" },
      { value: "mid", label: "Mid (30–59)" },
      { value: "low", label: "Low (0–29)" },
    ],
    resourceOptions: opts(RESOURCES, "All resources"),
    actionOptions: opts(actions, "All actions"),
    systemOptions: [
      { value: "all", label: "System & custom" },
      { value: "system", label: "System only" },
      { value: "custom", label: "Custom only" },
    ],

    // add-role form
    form,
    setFormField,
    togglePermCode,
    selectAllPerms,
    clearAllPerms,
    formError,
    cancelAdd,
    saveRole,
    resources: RESOURCES,

    // assign matrix
    assignDirty,
    assignSaved,
    saveAssign,
    revertAssign,
    toggleGrant,

    // detail modal
    currentRole,
    currentPerm,
    openDetail,
    closeDetail,
  };
}
