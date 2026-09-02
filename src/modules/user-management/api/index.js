import { apiClient } from "@/services/apiClient";

export function getUsersRequest(params) {
  return apiClient.get("/users", { params });
}

export function getAllRolesRequest() {
  return apiClient.get("/roles/all");
}

export function updateUserStatusRequest(userId, status) {
  return apiClient.patch(`/users/${userId}`, { status });
}

export function deleteUserRequest(userId) {
  return apiClient.delete(`/users/${userId}`);
}
