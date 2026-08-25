import { create } from "zustand";
import { persist } from "zustand/middleware";

// User/application settings state (theme, locale, preferences, etc.)
// Dark mode is persisted per-browser so it survives a refresh.
export const useSettingsStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (darkMode) => set({ darkMode }),
    }),
    { name: "bwin-settings" }
  )
);
