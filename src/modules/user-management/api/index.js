import { apiClient } from "@/services/apiClient";

export function getUsersRequest(params) {
  return apiClient.get("/users", { params });
}

export function getAllRolesRequest() {
  return apiClient.get("/roles/all");
}

export function createUserRequest(payload) {
  return apiClient.post("/users", payload);
}

export function createUserDetailsRequest(userId, payload) {
  return apiClient.post(`/users/${userId}/details`, payload);
}

export function getUserDetailsRequest(userId) {
  return apiClient.get(`/users/${userId}/details`);
}

export function updateUserStatusRequest(userId, status) {
  return apiClient.patch(`/users/${userId}`, { status });
}

export function updateUserRequest(userId, payload) {
  return apiClient.patch(`/users/${userId}`, payload);
}

export function updateUserDetailsRequest(userId, payload) {
  return apiClient.patch(`/users/${userId}/details`, payload);
}

export function replaceUserRolesRequest(userId, roleIds) {
  return apiClient.put(`/users/${userId}/roles`, { role_ids: roleIds });
}

export function deleteUserRequest(userId) {
  return apiClient.delete(`/users/${userId}`);
}

export function uploadUserAvatarRequest(userId, file) {
  const formData = new FormData();
  formData.append("file", file);
  // apiClient defaults every request to `Content-Type: application/json`.
  // Overriding it to a bare "multipart/form-data" (no boundary) would break
  // the upload — `undefined` removes the header instead, so the browser can
  // set its own `multipart/form-data; boundary=...` from the FormData body.
  return apiClient.post(`/users/${userId}/avatar`, formData, {
    headers: { "Content-Type": undefined },
  });
}

export function removeUserAvatarRequest(userId) {
  return apiClient.delete(`/users/${userId}/avatar`);
}
