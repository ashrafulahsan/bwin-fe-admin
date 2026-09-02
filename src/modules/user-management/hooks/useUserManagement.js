"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { USER_STATUSES } from "../constants/users.mock";
import { EMPTY_USER_FORM } from "../constants/userFormFields";
import { validateUserForm } from "../validation/validateUserForm";
import {
  createUser,
  createUserDetails,
  deleteUser,
  getAllRoles,
  getUserDetails,
  getUsers,
  updateUserStatus,
} from "../services";

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

// user_details fields the "New user" form can collect. year fields arrive
// as strings from the number inputs and need coercing; everything else goes
// through as-is. Blank values are dropped rather than sent as "" — the
// backend columns are nullable and an empty string is not a meaningful value
// for a date, a URL, or a year.
const DETAILS_FIELD_KEYS = [
  "gender",
  "date_of_birth",
  "nationality",
  "address",
  "city",
  "country",
  "designation",
  "department",
  "organization",
  "years_of_experience",
  "highest_degree",
  "university",
  "graduation_year",
  "linkedin_url",
  "youtube_url",
  "facebook_url",
  "website_url",
  "emergency_contact_name",
  "emergency_contact_phone",
  "notes",
];
const DETAILS_NUMBER_KEYS = new Set(["years_of_experience", "graduation_year"]);

// avatar_url is deliberately left out of this payload: there is no upload
// endpoint yet (app/modules/media is an empty stub), so the value the "Add
// user" form holds is only a local blob: preview for the admin's own screen
// — sending it would write an unusable, tab-local reference into the row.
// See onAvatarFile below (same approach the profile page's photo field uses).
function buildUserCreatePayload(form) {
  return {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim() || undefined,
    email: form.email.trim() || undefined,
    phone: form.phone.trim() || undefined,
    password: form.password_hash.trim() || undefined,
    bio: form.bio.trim() || undefined,
    language: form.language,
    status: form.status,
    role_ids: form.role_ids,
  };
}

function buildUserDetailsPayload(form) {
  const payload = {};
  for (const key of DETAILS_FIELD_KEYS) {
    const raw = form[key];
    if (raw === "" || raw === null || raw === undefined) continue;
    payload[key] = DETAILS_NUMBER_KEYS.has(key) ? Number(raw) : raw;
  }
  return payload;
}

// List/filters/pagination, and the "Add user" form, are all real (GET
// /users, GET /roles/all, POST /users, POST /users/{id}/details, PATCH
// /users/{id}, DELETE /users/{id}). Creating a user is two sequential
// requests: POST /users first (required fields only), then POST
// /users/{id}/details only if at least one extended-details field was
// filled in — see saveUser(). See UserDetailModal (view-only) and
// UserTable's "Edit" action, which still just opens that same view — there
// is no edit endpoint wired yet.
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
  const [form, setForm] = useState(EMPTY_USER_FORM);
  const [avatarFileName, setAvatarFileName] = useState(null);

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

  // GET /users doesn't embed user_details — the view modal fetches it
  // separately, only once a row is actually opened.
  const {
    data: detailData,
    isLoading: detailsLoading,
    isError: detailsFailed,
  } = useQuery({
    queryKey: ["users", "details", detailId],
    queryFn: () => getUserDetails(detailId),
    enabled: !!detailId,
  });

  useEffect(() => {
    if (detailsFailed) showError("Couldn't load this user's extended details.");
  }, [detailsFailed, showError]);

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

  const createUserMutation = useMutation({
    mutationFn: async (formValues) => {
      const user = await createUser(buildUserCreatePayload(formValues));
      const detailsPayload = buildUserDetailsPayload(formValues);
      if (Object.keys(detailsPayload).length > 0) {
        await createUserDetails(user.id, detailsPayload);
      }
      return user;
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      setView("list");
      setFormError(null);
      setForm(EMPTY_USER_FORM);
      setAvatarFileName(null);
      setListNotice(`${user.full_name || user.first_name} was created.`);
      showSuccess("User created.");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Couldn't create this user.";
      setFormError(message);
      showError(message);
    },
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
  const toggleFormRole = (roleId) =>
    setForm((f) => ({
      ...f,
      role_ids: f.role_ids.includes(roleId) ? f.role_ids.filter((r) => r !== roleId) : f.role_ids.concat(roleId),
    }));

  const onAvatarFile = (file) => {
    if (!file) return;
    setAvatarFileName(file.name);
    setForm((f) => ({ ...f, avatar_url: URL.createObjectURL(file) }));
  };
  const removeAvatar = () => {
    setAvatarFileName(null);
    setForm((f) => ({ ...f, avatar_url: "" }));
  };

  const openAddUser = () => {
    setView("add");
    setFormError(null);
    setListNotice(null);
  };
  const cancelAdd = () => {
    setView("list");
    setFormError(null);
    setForm(EMPTY_USER_FORM);
    setAvatarFileName(null);
  };

  const saveUser = () => {
    const error = validateUserForm(form, users);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    createUserMutation.mutate(form);
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

  const detailUser = users.find((u) => u.id === detailId) || null;
  const current = detailUser ? { ...detailUser, details: detailData || null } : null;
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
    detailsLoading: detailsLoading && !!detailId,
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
    avatarHint: avatarFileName || "JPG or PNG, square, at least 400×400px",
    onAvatarFile,
    removeAvatar,
    availableRoles: roles || [],
    toggleFormRole,
    formError,
    saveUser,
    savingUser: createUserMutation.isPending,
  };
}
