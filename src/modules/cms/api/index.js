import { apiClient } from "@/services/apiClient";

// -- Menus ----------------------------------------------------------------

export function getMenuCategoriesRequest() {
  return apiClient.get("/menus/categories");
}

export function getMenusRequest(params) {
  return apiClient.get("/menus", { params });
}

export function createMenuRequest(payload) {
  return apiClient.post("/menus", payload);
}

export function updateMenuRequest(menuId, payload) {
  return apiClient.patch(`/menus/${menuId}`, payload);
}

export function deleteMenuRequest(menuId) {
  return apiClient.delete(`/menus/${menuId}`);
}

export function restoreMenuRequest(menuId) {
  return apiClient.post(`/menus/${menuId}/restore`);
}
