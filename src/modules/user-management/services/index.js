import {
  createUserDetailsRequest,
  createUserRequest,
  deleteUserRequest,
  getAllRolesRequest,
  getUserDetailsRequest,
  getUsersRequest,
  removeUserAvatarRequest,
  replaceUserRolesRequest,
  updateUserDetailsRequest,
  updateUserRequest,
  updateUserStatusRequest,
  uploadUserAvatarRequest,
} from "../api";

// Every backend response is wrapped in `{success, message, data}` — unwrap
// once here so hooks/components never touch the envelope.

// A paginated `Page<UserRead>`: `{items, meta}`.
export async function getUsers(params) {
  const response = await getUsersRequest(params);
  return response.data?.data ?? { items: [], meta: null };
}

// `RoleSummary[]` — every role, for populating the role filter.
export async function getAllRoles() {
  const response = await getAllRolesRequest();
  return response.data?.data ?? [];
}

export async function updateUserStatus({ userId, status }) {
  const response = await updateUserStatusRequest(userId, status);
  return response.data?.data;
}

export async function deleteUser(userId) {
  await deleteUserRequest(userId);
  return userId;
}

// `UserRead` for the newly created row.
export async function createUser(payload) {
  const response = await createUserRequest(payload);
  return response.data?.data;
}

// `UserDetailsRead` for the row just attached to that user.
export async function createUserDetails(userId, payload) {
  const response = await createUserDetailsRequest(userId, payload);
  return response.data?.data;
}

// `UserDetailsRead`, or `null` if this user has never had a details row
// created — the backend 404s in that case, which is the normal state for a
// user nobody has filled extended details in for yet, not an error.
export async function getUserDetails(userId) {
  try {
    const response = await getUserDetailsRequest(userId);
    return response.data?.data ?? null;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}

// `UserRead` for the edited row.
export async function updateUser(userId, payload) {
  const response = await updateUserRequest(userId, payload);
  return response.data?.data;
}

// `UserDetailsRead` for the row just updated.
export async function updateUserDetails(userId, payload) {
  const response = await updateUserDetailsRequest(userId, payload);
  return response.data?.data;
}

// `UserRead` with its complete, replaced role set.
export async function replaceUserRoles(userId, roleIds) {
  const response = await replaceUserRolesRequest(userId, roleIds);
  return response.data?.data;
}

// `UserRead` with `avatar_url` pointing at the newly stored image.
export async function uploadUserAvatar(userId, file) {
  const response = await uploadUserAvatarRequest(userId, file);
  return response.data?.data;
}

// `UserRead` with `avatar_url` cleared.
export async function removeUserAvatar(userId) {
  const response = await removeUserAvatarRequest(userId);
  return response.data?.data;
}
