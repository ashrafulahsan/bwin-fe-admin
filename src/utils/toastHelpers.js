/**
 * Toast Helper Utilities
 * Functions for toast operations and utilities
 */

import { TOAST_TYPES, TOAST_CONFIG } from "@/constants/toastTypes";

/**
 * Generate unique ID for toast notifications
 * @returns {string} Unique ID
 */
export const generateToastId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get toast configuration by type
 * @param {string} type - Toast type
 * @returns {object} Toast configuration
 */
export const getToastConfig = (type) => {
  return TOAST_CONFIG[type] || TOAST_CONFIG.info;
};

/**
 * Validate toast type
 * @param {string} type - Toast type to validate
 * @returns {boolean} True if valid type
 */
export const isValidToastType = (type) => {
  return Object.values(TOAST_TYPES).includes(type);
};

/**
 * Parse toast duration (convert string to number if needed)
 * @param {number|string} duration - Duration in milliseconds
 * @returns {number} Duration as number
 */
export const parseDuration = (duration) => {
  if (typeof duration === "string") {
    const parsed = parseInt(duration, 10);
    return isNaN(parsed) ? 5000 : parsed;
  }
  return typeof duration === "number" ? duration : 5000;
};

/**
 * Create a toast notification object
 * @param {object} options - Toast options
 * @param {string} options.type - Notification type
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {number} options.duration - Duration to show (ms)
 * @returns {object} Toast object
 */
export const createToast = ({
  type = TOAST_TYPES.INFO,
  title,
  message,
  duration = 5000,
}) => {
  return {
    id: generateToastId(),
    type: isValidToastType(type) ? type : TOAST_TYPES.INFO,
    title: title || getToastConfig(type).title,
    message,
    duration: parseDuration(duration),
    createdAt: Date.now(),
  };
};

/**
 * Format toast message for display
 * Handles both string and object messages
 * @param {string|object} message - Message to format
 * @returns {string} Formatted message
 */
export const formatToastMessage = (message) => {
  if (typeof message === "string") {
    return message;
  }
  if (message && typeof message === "object") {
    if (message.message) return message.message;
    if (message.detail) return message.detail;
    if (message.error) return message.error;
  }
  return "An action was completed";
};

/**
 * Truncate long messages
 * @param {string} message - Message to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated message
 */
export const truncateMessage = (message, maxLength = 150) => {
  if (!message) return "";
  if (message.length <= maxLength) return message;
  return `${message.substring(0, maxLength)}...`;
};

/**
 * Get icon component name from toast type
 * @param {string} type - Toast type
 * @returns {string} Icon name
 */
export const getToastIcon = (type) => {
  const config = getToastConfig(type);
  return config.icon;
};

/**
 * Merge toast options with defaults
 * @param {object} options - User options
 * @returns {object} Merged options
 */
export const mergeToastOptions = (options) => {
  return {
    type: TOAST_TYPES.INFO,
    duration: 5000,
    ...options,
  };
};

/**
 * Check if toast should auto-dismiss
 * Duration of 0 or negative means no auto-dismiss
 * @param {number} duration - Toast duration
 * @returns {boolean} True if should auto-dismiss
 */
export const shouldAutoDismiss = (duration) => {
  return duration > 0;
};

/**
 * Get dismiss delay for animations
 * Should be less than duration for smooth exit
 * @param {number} duration - Toast duration
 * @returns {number} Dismiss delay (ms)
 */
export const getDismissDelay = (duration) => {
  // Start exit animation 500ms before actual dismissal
  return Math.max(duration - 500, 0);
};

/**
 * Format duration for progress bar
 * Returns duration in seconds for display
 * @param {number} duration - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDurationDisplay = (duration) => {
  return `${(duration / 1000).toFixed(1)}s`;
};
