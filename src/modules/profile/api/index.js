import { apiClient } from "@/services/apiClient";
import { uploadFile } from "@/services/apiUtils";

export function getMyDetailsRequest() {
  return apiClient.get("/auth/my-details");
}

export function updateMyDetailsRequest(payload) {
  return apiClient.patch("/auth/my-details", payload);
}

export function updateMyProfileRequest(payload) {
  return apiClient.patch("/auth/me", payload);
}

export function getMyActivityRequest(params) {
  return apiClient.get("/my-activity-logs", { params });
}

export function changePasswordRequest(payload) {
  return apiClient.post("/auth/change-password", payload);
}

// Uses the common `uploadFile` helper (src/services/apiUtils.js) so the
// multipart request goes through the same path as every other file upload.
export function uploadMyAvatarRequest(userId, file) {
  const formData = new FormData();
  formData.append("file", file);
  return uploadFile(`/users/${userId}/avatar`, formData);
}

export function removeMyAvatarRequest(userId) {
  return apiClient.delete(`/users/${userId}/avatar`);
}
