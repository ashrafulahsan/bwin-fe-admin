import { apiClient } from "./apiClient";

/**
 * Common API Response and Request utilities
 */

/**
 * Handle API error responses
 * @param {Error} error - Axios error object
 * @returns {Object} - Normalized error object
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      message: error.response.data?.message || "An error occurred",
      data: error.response.data,
      code: error.response.data?.code,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: "No response from server",
      data: null,
      code: "NO_RESPONSE",
    };
  } else {
    // Error in request setup
    return {
      status: 0,
      message: error.message || "An error occurred",
      data: null,
      code: "ERROR",
    };
  }
};

/**
 * Normalize API response data
 * @param {Object} response - API response
 * @returns {Object} - Normalized response
 */
export const normalizeResponse = (response) => {
  return {
    success: response.status >= 200 && response.status < 300,
    status: response.status,
    data: response.data?.data || response.data,
    message: response.data?.message || "Success",
  };
};

/**
 * Build query string from object
 * @param {Object} params - Query parameters
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
  );
  return new URLSearchParams(filtered).toString();
};

/**
 * Get file from API
 * @param {string} url - File URL
 * @param {Object} params - Query parameters
 * @returns {Promise<Blob>}
 */
export const downloadFile = async (url, params = {}) => {
  const response = await apiClient.get(url, {
    params,
    responseType: "blob",
  });
  return response.data;
};

/**
 * Upload file(s) to API
 * @param {string} url - Upload endpoint
 * @param {FormData} formData - Form data with files
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise}
 */
export const uploadFile = async (url, formData, onUploadProgress) => {
  const response = await apiClient.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response.data;
};
