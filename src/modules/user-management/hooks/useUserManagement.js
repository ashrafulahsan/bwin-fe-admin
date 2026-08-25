"use client";

import { useMemo, useState } from "react";
import { USERS, USER_STATUSES } from "../constants/users.mock";
import { EMPTY_USER_FORM } from "../constants/userFormFields";
import { validateUserForm } from "../validation/validateUserForm";

const capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);
const roleNamesOf = (u) => (u.roles || []).map((r) => r.name);

// Mirrors the state machine in the Claude Design source (admin-panel-user-management.dc.html)
// one-to-one: list/filter state, the "New user" form, and the detail modal. Backed by
// in-memory mock data (constants/users.mock.js) — swap the setUsers mutations for
// modules/user-management/services once the users API exists.
export function useUserManagement() {
  const [users, setUsers] = useState(USERS);
  const [view, setView] = useState("list"); // "list" | "add"
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [loginFilter, setLoginFilter] = useState("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [listNotice, setListNotice] = useState(null);
  const [formError, setFormError] = useState(null);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_USER_FORM);

  const roleSet = useMemo(() => [...new Set(users.flatMap(roleNamesOf))], [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (!showDeleted && u.deleted_at) return false;
      if (showDeleted && !u.deleted_at) return false;
      if (roleFilter !== "all" && !roleNamesOf(u).includes(roleFilter)) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (verifiedFilter === "verified" && !u.email_verified_at) return false;
      if (verifiedFilter === "unverified" && u.email_verified_at) return false;
      if (loginFilter === "social" && !u.is_social_login) return false;
      if (loginFilter === "password" && u.is_social_login) return false;
      if (q) {
        const hay = `${u.first_name} ${u.last_name} ${u.email || ""} ${u.phone || ""} ${roleNamesOf(u).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [users, search, roleFilter, statusFilter, verifiedFilter, loginFilter, showDeleted]);

  const toggleStatus = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u)));
  };

  const toggleDeletedFor = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, deleted_at: u.deleted_at ? null : new Date().toISOString().slice(0, 19).replace("T", " ") } : u
      )
    );
  };

  const setFormField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggleFormRole = (name) =>
    setForm((f) => ({ ...f, roles: f.roles.includes(name) ? f.roles.filter((r) => r !== name) : f.roles.concat(name) }));

  const openAddUser = () => {
    setView("add");
    setFormError(null);
    setListNotice(null);
  };
  const cancelAdd = () => {
    setView("list");
    setFormError(null);
    setForm(EMPTY_USER_FORM);
    setExtrasOpen(false);
  };

  const saveUser = () => {
    const error = validateUserForm(form, users);
    if (error) {
      setFormError(error);
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const newUser = {
      id: `new-${users.length + 1}-${today}`,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim() || null,
      avatar_url: null,
      status: form.status,
      language: form.language,
      email_verified_at: null,
      phone_verified_at: null,
      last_login_at: null,
      created_at: today,
      deleted_at: null,
      is_social_login: false,
      social_provider: null,
      roles: form.roles.map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), level: 0 })),
      details: {
        gender: form.gender,
        date_of_birth: form.date_of_birth,
        nationality: form.nationality,
        address: form.address,
        city: form.city,
        country: form.country,
        designation: form.designation,
        department: form.department,
        organization: form.organization,
        years_of_experience: form.years_of_experience,
        highest_degree: form.highest_degree,
        university: form.university,
        graduation_year: form.graduation_year,
        linkedin_url: form.linkedin_url,
        youtube_url: form.youtube_url,
        facebook_url: form.facebook_url,
        website_url: form.website_url,
        emergency_contact_name: form.emergency_contact_name,
        emergency_contact_phone: form.emergency_contact_phone,
        notes: form.notes,
      },
    };
    setUsers((prev) => prev.concat(newUser));
    setView("list");
    setFormError(null);
    setSearch("");
    setForm(EMPTY_USER_FORM);
    setExtrasOpen(false);
    setListNotice(
      `${[newUser.first_name, newUser.last_name].filter(Boolean).join(" ")} was created — 1 users row, 1 user_details row, ${
        form.roles.length
      } user_roles row${form.roles.length === 1 ? "" : "s"}.`
    );
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setVerifiedFilter("all");
    setLoginFilter("all");
  };

  const statusOptions = [{ value: "all", label: "All statuses" }].concat(
    USER_STATUSES.map((v) => ({ value: v, label: capitalize(v) }))
  );
  const roleOptions = [{ value: "all", label: "All roles" }].concat(roleSet.map((r) => ({ value: r, label: r })));
  const verifiedOptions = [
    { value: "all", label: "Any verification" },
    { value: "verified", label: "Email verified" },
    { value: "unverified", label: "Not verified" },
  ];
  const loginOptions = [
    { value: "all", label: "Any login type" },
    { value: "password", label: "Password" },
    { value: "social", label: "Social" },
  ];

  const current = users.find((u) => u.id === detailId) || null;

  return {
    // list
    filtered,
    totalCount: users.length,
    noResults: users.length > 0 && filtered.length === 0,
    roleNamesOf,
    toggleStatus,
    toggleDeletedFor,
    openDetail: setDetailId,

    // filters
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    verifiedFilter,
    setVerifiedFilter,
    loginFilter,
    setLoginFilter,
    statusOptions,
    roleOptions,
    verifiedOptions,
    loginOptions,
    resetFilters,
    showDeleted,
    toggleShowDeleted: () => setShowDeleted((v) => !v),

    // list notice
    listNotice,
    dismissNotice: () => setListNotice(null),

    // detail modal
    current,
    closeDetail: () => setDetailId(null),

    // add-user view
    view,
    openAddUser,
    cancelAdd,
    form,
    setFormField,
    toggleFormRole,
    extrasOpen,
    toggleExtras: () => setExtrasOpen((o) => !o),
    formError,
    saveUser,
  };
}
