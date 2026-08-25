import { create } from "zustand";

// Global UI/app shell state — sidebar collapse/expand, responsive breakpoint,
// and the header's notification/profile popovers. Mirrors the interaction
// state machine in the Admin Panel design (single-open sidebar submenu,
// auto-collapse below 860px).
export const useAppStore = create((set, get) => ({
  isSidebarCollapsed: false,
  isMobile: false,
  openGroupKey: null,
  notificationsOpen: false,
  profileOpen: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  setIsMobile: (isMobile) =>
    set((state) =>
      isMobile === state.isMobile ? {} : { isMobile, isSidebarCollapsed: isMobile }
    ),

  toggleGroup: (key) =>
    set((state) => ({ openGroupKey: state.openGroupKey === key ? null : key })),

  setOpenGroupKey: (key) => set({ openGroupKey: key }),

  closeGroup: () => set({ openGroupKey: null }),

  toggleNotifications: () =>
    set((state) => ({ notificationsOpen: !state.notificationsOpen, profileOpen: false })),

  closeNotifications: () => set({ notificationsOpen: false }),

  toggleProfile: () =>
    set((state) => ({ profileOpen: !state.profileOpen, notificationsOpen: false })),

  closeProfile: () => set({ profileOpen: false }),

  closePopovers: () => {
    if (get().notificationsOpen || get().profileOpen) {
      set({ notificationsOpen: false, profileOpen: false });
    }
  },
}));
