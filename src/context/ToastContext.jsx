"use client";

/**
 * Toast Context
 * Manages global toast notifications state and methods
 */

import React, { createContext, useCallback, useState } from "react";
import {
  TOAST_TYPES,
  TOAST_POSITIONS,
  DEFAULT_TOAST_CONFIG,
} from "@/constants/toastTypes";
import {
  createToast,
  formatToastMessage,
  mergeToastOptions,
} from "@/utils/toastHelpers";

/**
 * Create Toast Context
 */
export const ToastContext = createContext();

/**
 * Toast Provider Component
 * Wraps the application and provides toast functionality
 */
export const ToastProvider = ({
  children,
  position = TOAST_POSITIONS.TOP_RIGHT,
  maxNotifications = DEFAULT_TOAST_CONFIG.maxNotifications,
}) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast to the queue
   */
  const addToast = useCallback(
    (toast) => {
      setToasts((prevToasts) => {
        // Check for duplicate toasts (same message, type, within 1 second)
        const isDuplicate = prevToasts.some(
          (t) =>
            t.type === toast.type &&
            t.message === toast.message &&
            Date.now() - t.createdAt < 1000
        );

        if (isDuplicate) {
          return prevToasts;
        }

        // Limit maximum visible notifications
        const updatedToasts = [...prevToasts, toast];
        if (updatedToasts.length > maxNotifications) {
          return updatedToasts.slice(-maxNotifications);
        }

        return updatedToasts;
      });
    },
    [maxNotifications]
  );

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Show a toast notification
   */
  const showToast = useCallback(
    (type, message, options = {}) => {
      const mergedOptions = mergeToastOptions(options);
      const toast = createToast({
        type,
        message: formatToastMessage(message),
        title: mergedOptions.title,
        duration: mergedOptions.duration,
      });

      addToast(toast);

      // Auto-dismiss if duration is set
      if (toast.duration > 0) {
        setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
      }

      return toast.id;
    },
    [addToast, removeToast]
  );

  /**
   * Show success notification
   */
  const showSuccess = useCallback(
    (message, options) => {
      return showToast(TOAST_TYPES.SUCCESS, message, {
        ...options,
        title: options?.title || "Success",
      });
    },
    [showToast]
  );

  /**
   * Show error notification
   */
  const showError = useCallback(
    (message, options) => {
      return showToast(TOAST_TYPES.ERROR, message, {
        ...options,
        title: options?.title || "Error",
        duration: options?.duration || 7000, // Errors stay longer by default
      });
    },
    [showToast]
  );

  /**
   * Show warning notification
   */
  const showWarning = useCallback(
    (message, options) => {
      return showToast(TOAST_TYPES.WARNING, message, {
        ...options,
        title: options?.title || "Warning",
        duration: options?.duration || 6000,
      });
    },
    [showToast]
  );

  /**
   * Show info notification
   */
  const showInfo = useCallback(
    (message, options) => {
      return showToast(TOAST_TYPES.INFO, message, {
        ...options,
        title: options?.title || "Information",
      });
    },
    [showToast]
  );

  /**
   * Show failed notification
   */
  const showFailed = useCallback(
    (message, options) => {
      return showToast(TOAST_TYPES.FAILED, message, {
        ...options,
        title: options?.title || "Failed",
        duration: options?.duration || 7000,
      });
    },
    [showToast]
  );

  /**
   * Context value
   */
  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showFailed,
    position,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export default ToastProvider;
