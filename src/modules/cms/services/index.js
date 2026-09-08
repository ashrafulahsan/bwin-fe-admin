import {
  createMenuRequest,
  deleteMenuRequest,
  getMenuCategoriesRequest,
  getMenusRequest,
  restoreMenuRequest,
  updateMenuRequest,
} from "../api";

// Every backend response is wrapped in `{success, message, data}` — unwrap
// once here so hooks/components never touch the envelope.

// `CategorySummary[]` — the active Menu Category taxonomy a menu item may
// belong to.
export async function getMenuCategories() {
  const response = await getMenuCategoriesRequest();
  return response.data?.data ?? [];
}

// A paginated `Page<MenuRead>`: `{items, meta}`.
export async function getMenus(params) {
  const response = await getMenusRequest(params);
  return response.data?.data ?? { items: [], meta: null };
}

// `MenuRead` for the newly created row.
export async function createMenu(payload) {
  const response = await createMenuRequest(payload);
  return response.data?.data;
}

// `MenuRead` for the edited row — also used to re-parent/reorder an item,
// since `PATCH /menus/{id}` accepts `parent_id` and `order` too.
export async function updateMenu(menuId, payload) {
  const response = await updateMenuRequest(menuId, payload);
  return response.data?.data;
}

// Soft delete; refused by the backend while the item still has children.
export async function deleteMenu(menuId) {
  await deleteMenuRequest(menuId);
  return menuId;
}

// `MenuRead` for the restored row.
export async function restoreMenu(menuId) {
  const response = await restoreMenuRequest(menuId);
  return response.data?.data;
}
