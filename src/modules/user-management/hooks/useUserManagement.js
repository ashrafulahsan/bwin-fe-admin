"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { USER_STATUSES } from "../constants/users.mock";
import { EMPTY_USER_FORM } from "../constants/userFormFields";
import { validateUserForm } from "../validation/validateUserForm";
import { deleteUser, getAllRoles, getUsers, updateUserStatus } from "../services";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 350;

// sort_by is validated against real User model columns server-side (an
// unknown one errors, it doesn't just get ignored) — offering a fixed list
// of known-good columns rather than free text keeps this from ever 400ing.
const SORT_FIELDS = [
  { value: "created_at", label: "Date created" },
  { value: "first_name", label: "First name" },
  { value: "email", label: "Email" },
  { value: "last_login_at", label: "Last login" },
  { value: "status", label: "Status" },
];
const DEFAULT_SORT_BY = "created_at";
const DEFAULT_SORT_ORDER = "desc";

const capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);
const roleNamesOf = (u) => (u.roles || []).map((r) => r.name);

// List/filters/pagination are real (GET /users, GET /roles/all, PATCH
// /users/{id}, DELETE /users/{id}). The "Add user" form below is not: there
// is no role_id-aware create flow wired up yet, so saveUser() stays exactly
// what it always was — local validation plus a success notice, nothing
// persisted. See UserDetailModal (view-only) and UserTable's "Edit" action,
// which still just opens that same view — there is no edit endpoint wired
// either.
export function useUserManagement() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const [view, setView] = useState("list"); // "list" | "add"
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilterState] = useState("all");
  const [statusFilter, setStatusFilterState] = useState("all");
  const [sortBy, setSortByState] = useState(DEFAULT_SORT_BY);
  const [sortOrder, setSortOrderState] = useState(DEFAULT_SORT_ORDER);
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [listNotice, setListNotice] = useState(null);
  const [formError, setFormError] = useState(null);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_USER_FORM);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page,
    page_size: PAGE_SIZE,
    search: debouncedSearch || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  const {
    data: usersPage,
    isLoading,
    isFetching,
    isError: usersFailed,
  } = useQuery({
    queryKey: ["users", "list", queryParams],
    queryFn: () => getUsers(queryParams),
    placeholderData: (prev) => prev,
  });

  const { data: roles } = useQuery({ queryKey: ["roles", "all"], queryFn: getAllRoles });

  useEffect(() => {
    if (usersFailed) showError("Couldn't load users from the server.");
  }, [usersFailed, showError]);

  const statusMutation = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      showSuccess("Status updated.");
    },
    onError: () => showError("Couldn't update this user's status."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      showSuccess("User deleted.");
    },
    onError: () => showError("Couldn't delete this user."),
    onSettled: () => setDeleteId(null),
  });

  const users = usersPage?.items || [];
  const meta = usersPage?.meta || null;

  const setSearch = (value) => {
    setSearchState(value);
    setPage(1);
  };
  const setRoleFilter = (value) => {
    setRoleFilterState(value);
    setPage(1);
  };
  const setStatusFilter = (value) => {
    setStatusFilterState(value);
    setPage(1);
  };
  const setSortBy = (value) => {
    setSortByState(value);
    setPage(1);
  };
  const setSortOrder = (value) => {
    setSortOrderState(value);
    setPage(1);
  };

  const toggleStatus = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    statusMutation.mutate({ userId: id, status: user.status === "active" ? "suspended" : "active" });
  };

  const requestDelete = (id) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);
  const confirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
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

  // Local-only: see the module doc comment above. Validates and gives the
  // same confirmation the mock version always did, but nothing is sent to
  // the server — there is no real create-user flow wired up yet.
  const saveUser = () => {
    const error = validateUserForm(form, users);
    if (error) {
      setFormError(error);
      return;
    }
    const name = [form.first_name.trim(), form.last_name.trim()].filter(Boolean).join(" ");
    setView("list");
    setFormError(null);
    setForm(EMPTY_USER_FORM);
    setExtrasOpen(false);
    setListNotice(`${name} was validated, but user creation isn't connected to the server yet — nothing was saved.`);
  };

  const resetFilters = () => {
    setSearchState("");
    setDebouncedSearch("");
    setRoleFilterState("all");
    setStatusFilterState("all");
    setSortByState(DEFAULT_SORT_BY);
    setSortOrderState(DEFAULT_SORT_ORDER);
    setPage(1);
  };

  const statusOptions = [{ value: "all", label: "All statuses" }].concat(
    USER_STATUSES.map((v) => ({ value: v, label: capitalize(v) }))
  );
  const roleOptions = [{ value: "all", label: "All roles" }].concat(
    (roles || []).map((r) => ({ value: r.slug, label: r.name }))
  );
  const sortByOptions = SORT_FIELDS;
  const sortOrderOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ];

  const current = users.find((u) => u.id === detailId) || null;
  const deleting = users.find((u) => u.id === deleteId) || null;

  return {
    // list
    rows: users,
    meta,
    loading: isLoading,
    fetching: isFetching,
    noResults: !isLoading && users.length === 0,
    roleNamesOf,
    toggleStatus,
    openDetail: setDetailId,

    // pagination
    page,
    onPrevPage: () => setPage((p) => Math.max(1, p - 1)),
    onNextPage: () => setPage((p) => (meta?.has_next ? p + 1 : p)),

    // filters
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    statusOptions,
    roleOptions,
    sortByOptions,
    sortOrderOptions,
    resetFilters,

    // list notice
    listNotice,
    dismissNotice: () => setListNotice(null),

    // detail modal
    current,
    closeDetail: () => setDetailId(null),

    // delete confirm
    deleteOpen: !!deleteId,
    deleteTarget: deleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
    deleting: deleteMutation.isPending,

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
