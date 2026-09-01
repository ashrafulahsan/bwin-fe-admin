import { apiClient } from "./apiClient";

/**
 * Authentication Service
 * Handles all auth-related API calls
 */

export const authService = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{access_token, refresh_token, user}>}
   */
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} data - Registration data
   * @returns {Promise<{user}>}
   */
  register: async (data) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  /**
   * Logout - clear tokens from server
   * @returns {Promise}
   */
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<{access_token}>}
   */
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Get current user info
   * @returns {Promise<{user}>}
   */
  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise}
   */
  requestPasswordReset: async (email) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  /**
   * Reset password with token
   * @param {Object} data - Reset token and new password
   * @returns {Promise}
   */
  resetPassword: async (data) => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },
};
