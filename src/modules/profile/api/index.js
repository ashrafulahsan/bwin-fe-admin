import { apiClient } from "@/services/apiClient";

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
