import {
  deleteUserRequest,
  getAllRolesRequest,
  getUsersRequest,
  updateUserStatusRequest,
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
