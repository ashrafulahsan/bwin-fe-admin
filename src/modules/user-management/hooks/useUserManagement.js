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
  removeUserAvatar,
  replaceUserRoles,
  updateUser,
  updateUserDetails,
  updateUserStatus,
  uploadUserAvatar,
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

// avatar_url is deliberately left out of this payload: the form only ever
// holds either the persisted URL or a local blob: preview, never something
// worth writing to the row directly. The real image goes up separately,
// after the user exists, via POST /users/{id}/avatar — see
// createUserMutation below.
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

// Same avatar_url omission as buildUserCreatePayload — the image itself
// goes through POST/DELETE /users/{id}/avatar, driven by avatarAction, not
// this JSON payload. A blank text field here is likewise omitted rather
// than nulled, so clearing a field client-side without meaning to doesn't
// blank it out server-side (same convention the profile module's compact()
// helper uses).
function buildUserUpdatePayload(form) {
  return {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim() || undefined,
    email: form.email.trim() || undefined,
    phone: form.phone.trim() || undefined,
    bio: form.bio.trim() || undefined,
    language: form.language,
    status: form.status,
  };
}

function formFromUser(user) {
  return {
    ...EMPTY_USER_FORM,
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.phone || "",
    avatar_url: user.avatar_url || "",
    status: user.status,
    language: user.language,
    bio: user.bio || "",
    role_ids: (user.roles || []).map((r) => r.id),
  };
}

function formFromDetails(details) {
  return Object.fromEntries(
    DETAILS_FIELD_KEYS.map((key) => [key, details?.[key] != null ? String(details[key]) : ""])
  );
}

// List/filters/pagination, and both the "Add user" and "Edit user" views,
// are all real (GET /users, GET /roles/all, POST /users, GET/POST/PATCH
// /users/{id}/details, PATCH /users/{id}, PUT /users/{id}/roles, DELETE
// /users/{id}). Creating a user is two sequential requests: POST /users
// first, then POST /users/{id}/details only if at least one extended-details
// field was filled in — see saveUser(). Editing is up to three: PATCH
// /users/{id}, PUT /users/{id}/roles (replaces the complete role set, so no
// grant/revoke diffing is needed), and PATCH or POST /users/{id}/details
// depending on whether a row already existed — see saveEdit().
export function useUserManagement() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const [view, setView] = useState("list"); // "list" | "add" | "edit"
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilterState] = useState("all");
  const [statusFilter, setStatusFilterState] = useState("all");
  const [sortBy, setSortByState] = useState(DEFAULT_SORT_BY);
  const [sortOrder, setSortOrderState] = useState(DEFAULT_SORT_ORDER);
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [listNotice, setListNotice] = useState(null);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState(EMPTY_USER_FORM);
  const [avatarFileName, setAvatarFileName] = useState(null);
  // The actual File object a picked photo needs to be uploaded, plus what to
  // do with it on save — `form.avatar_url` only ever holds a preview (the
  // persisted URL, or a local blob: one), never something worth PATCHing
  // straight into the user row. null = leave the avatar as it is.
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarAction, setAvatarAction] = useState(null); // null | "upload" | "remove"

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

  // GET /users doesn't embed user_details — the view modal and the edit form
  // both fetch it separately, only once a row is actually opened. They share
  // one query keyed on whichever user is active in either surface.
  const activeDetailUserId = detailId || editId;
  const {
    data: detailData,
    isLoading: detailsLoading,
    isSuccess: detailsLoaded,
    isError: detailsFailed,
  } = useQuery({
    queryKey: ["users", "details", activeDetailUserId],
    queryFn: () => getUserDetails(activeDetailUserId),
    enabled: !!activeDetailUserId,
  });

  useEffect(() => {
    if (detailsFailed) showError("Couldn't load this user's extended details.");
  }, [detailsFailed, showError]);

  // Seeds the edit form's Personal/Address/Professional/Educational/Social/
  // Emergency fields once user_details resolves — Basic + Roles are already
  // filled in synchronously by openEditUser() from the row already in
  // memory, so this only ever touches the second half of the form.
  useEffect(() => {
    if (view !== "edit" || !editId || !detailsLoaded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((f) => ({ ...f, ...formFromDetails(detailData) }));
  }, [view, editId, detailsLoaded, detailData]);

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
    mutationFn: async ({ formValues, avatarFile: file, avatarAction: action }) => {
      let user = await createUser(buildUserCreatePayload(formValues));
      const detailsPayload = buildUserDetailsPayload(formValues);
      if (Object.keys(detailsPayload).length > 0) {
        await createUserDetails(user.id, detailsPayload);
      }
      // "remove" is meaningless for a user that didn't exist a moment ago —
      // only an actual picked file is worth a follow-up request here.
      if (action === "upload" && file) {
        user = await uploadUserAvatar(user.id, file);
      }
      return user;
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      setView("list");
      setFormError(null);
      setForm(EMPTY_USER_FORM);
      setAvatarFileName(null);
      setAvatarFile(null);
      setAvatarAction(null);
      setListNotice(`${user.full_name || user.first_name} was created.`);
      showSuccess("User created.");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Couldn't create this user.";
      setFormError(message);
      showError(message);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, formValues, hadDetails, avatarFile: file, avatarAction: action }) => {
      let user = await updateUser(userId, buildUserUpdatePayload(formValues));
      await replaceUserRoles(userId, formValues.role_ids);
      const detailsPayload = buildUserDetailsPayload(formValues);
      if (hadDetails) {
        await updateUserDetails(userId, detailsPayload);
      } else if (Object.keys(detailsPayload).length > 0) {
        await createUserDetails(userId, detailsPayload);
      }
      if (action === "upload" && file) {
        user = await uploadUserAvatar(userId, file);
      } else if (action === "remove") {
        user = await removeUserAvatar(userId);
      }
      return user;
    },
    onSuccess: (user, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({ queryKey: ["users", "details", userId] });
      setView("list");
      setEditId(null);
      setFormError(null);
      setForm(EMPTY_USER_FORM);
      setAvatarFileName(null);
      setAvatarFile(null);
      setAvatarAction(null);
      setListNotice(`${user.full_name || user.first_name} was updated.`);
      showSuccess("User updated.");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Couldn't update this user.";
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

  // Picking a file only stages it — the actual upload happens on save,
  // bundled with everything else so a cancelled form never touches the
  // server. `avatar_url` here is a local blob: preview only, for the
  // <Avatar> in the form to render; it is never sent as-is (see
  // buildUserCreatePayload / buildUserUpdatePayload above).
  const onAvatarFile = (file) => {
    if (!file) return;
    setAvatarFileName(file.name);
    setAvatarFile(file);
    setAvatarAction("upload");
    setForm((f) => ({ ...f, avatar_url: URL.createObjectURL(file) }));
  };
  const removeAvatar = () => {
    setAvatarFileName(null);
    setAvatarFile(null);
    setAvatarAction("remove");
    setForm((f) => ({ ...f, avatar_url: "" }));
  };

  const openAddUser = () => {
    setEditId(null);
    setView("add");
    setFormError(null);
    setListNotice(null);
  };
  const cancelAdd = () => {
    setView("list");
    setFormError(null);
    setForm(EMPTY_USER_FORM);
    setAvatarFileName(null);
    setAvatarFile(null);
    setAvatarAction(null);
  };

  const saveUser = () => {
    const error = validateUserForm(form, users);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    createUserMutation.mutate({ formValues: form, avatarFile, avatarAction });
  };

  // Basic + Roles come from the row already held in the list query, so they
  // appear instantly; Personal/Address/Professional/Educational/Social/
  // Emergency fill in a moment later once GET /users/{id}/details resolves —
  // see the seeding effect above.
  const openEditUser = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    setEditId(id);
    setView("edit");
    setFormError(null);
    setListNotice(null);
    setAvatarFileName(null);
    setAvatarFile(null);
    setAvatarAction(null);
    setForm(formFromUser(user));
  };
  const cancelEdit = () => {
    setView("list");
    setEditId(null);
    setFormError(null);
    setForm(EMPTY_USER_FORM);
    setAvatarFileName(null);
    setAvatarFile(null);
    setAvatarAction(null);
  };

  const saveEdit = () => {
    if (!editId) return;
    const error = validateUserForm(form, users, editId);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    updateUserMutation.mutate({
      userId: editId,
      formValues: form,
      hadDetails: !!detailData,
      avatarFile,
      avatarAction,
    });
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

    // add/edit user views
    view,
    openAddUser,
    cancelAdd,
    editId,
    openEditUser,
    cancelEdit,
    editDetailsLoading: detailsLoading && !!editId && view === "edit",
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
    saveEdit,
    savingEdit: updateUserMutation.isPending,
  };
}
