import { create } from "zustand";

// TODO: wire up JWT + refresh token login/logout logic via modules/auth/services
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}));
