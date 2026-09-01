/**
 * Toast Notification Types Configuration
 * Centralized configuration for all notification types
 */

export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  FAILED: "failed",
};

/**
 * Toast Configuration for each type
 * Includes icon, colors, and styling information
 */
export const TOAST_CONFIG = {
  success: {
    type: "success",
    title: "Success",
    icon: "CheckCircle",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
    progressColor: "bg-green-500",
    darkBgColor: "dark:bg-green-900/20",
    darkTextColor: "dark:text-green-300",
    darkBorderColor: "dark:border-green-700",
  },
  error: {
    type: "error",
    title: "Error",
    icon: "XCircle",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-600",
    progressColor: "bg-red-500",
    darkBgColor: "dark:bg-red-900/20",
    darkTextColor: "dark:text-red-300",
    darkBorderColor: "dark:border-red-700",
  },
  warning: {
    type: "warning",
    title: "Warning",
    icon: "AlertTriangle",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconColor: "text-amber-600",
    progressColor: "bg-amber-500",
    darkBgColor: "dark:bg-amber-900/20",
    darkTextColor: "dark:text-amber-300",
    darkBorderColor: "dark:border-amber-700",
  },
  info: {
    type: "info",
    title: "Information",
    icon: "Info",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    progressColor: "bg-blue-500",
    darkBgColor: "dark:bg-blue-900/20",
    darkTextColor: "dark:text-blue-300",
    darkBorderColor: "dark:border-blue-700",
  },
  failed: {
    type: "failed",
    title: "Failed",
    icon: "Ban",
    textColor: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    iconColor: "text-rose-600",
    progressColor: "bg-rose-500",
    darkBgColor: "dark:bg-rose-900/20",
    darkTextColor: "dark:text-rose-300",
    darkBorderColor: "dark:border-rose-700",
  },
};

/**
 * Toast Position Options
 */
export const TOAST_POSITIONS = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
};

/**
 * Default Toast Configuration
 */
export const DEFAULT_TOAST_CONFIG = {
  duration: 5000, // 5 seconds
  position: TOAST_POSITIONS.TOP_RIGHT,
  maxNotifications: 5,
};

/**
 * Toast Position Styles
 * CSS classes for positioning
 */
export const POSITION_CLASSES = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

/**
 * Toast Container Position Classes
 * For the entire container
 */
export const CONTAINER_POSITION_CLASSES = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
  "top-center": "top-0 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
};
