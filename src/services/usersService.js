import { apiClient } from "./apiClient";

/**
 * Users Service
 * Handles all user management API calls
 */

export const usersService = {
  /**
   * Get all users with pagination and filters
   * @param {Object} params - Query parameters {page, limit, search, role, status}
   * @returns {Promise<{data: [], total, pages}>}
   */
  getUsers: async (params = {}) => {
    const response = await apiClient.get("/users", { params });
    return response.data;
  },

  /**
   * Get single user by ID
   * @param {number|string} userId - User ID
   * @returns {Promise<{user}>}
   */
  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Create a new user
   * @param {Object} data - User data
   * @returns {Promise<{user}>}
   */
  createUser: async (data) => {
    const response = await apiClient.post("/users", data);
    return response.data;
  },

  /**
   * Update user information
   * @param {number|string} userId - User ID
   * @param {Object} data - Updated user data
   * @returns {Promise<{user}>}
   */
  updateUser: async (userId, data) => {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  },

  /**
   * Delete a user
   * @param {number|string} userId - User ID
   * @returns {Promise}
   */
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  /**
   * Assign roles to user
   * @param {number|string} userId - User ID
   * @param {Array} roleIds - Array of role IDs
   * @returns {Promise}
   */
  assignRoles: async (userId, roleIds) => {
    const response = await apiClient.post(`/users/${userId}/roles`, { roleIds });
    return response.data;
  },

  /**
   * Get user permissions
   * @param {number|string} userId - User ID
   * @returns {Promise<{permissions: []}>}
   */
  getUserPermissions: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/permissions`);
    return response.data;
  },
};
