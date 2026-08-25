import { apiClient } from "@/services/apiClient";

// Raw endpoint definitions — modules/auth/services orchestrates on top of these.
export function loginRequest({ role, identifier, password, remember }) {
  return apiClient.post("/auth/login", { role, identifier, password, remember });
}
