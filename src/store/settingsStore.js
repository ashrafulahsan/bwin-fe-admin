import { create } from "zustand";

// TODO: user/application settings state (theme, locale, preferences, etc.)
export const useSettingsStore = create((set) => ({
  theme: "light",

  setTheme: (theme) => set({ theme }),
}));
