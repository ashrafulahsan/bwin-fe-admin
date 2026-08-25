import { create } from "zustand";

// TODO: global UI/app state (e.g. sidebar collapsed, active module, etc.)
export const useAppStore = create((set) => ({
  isSidebarCollapsed: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
