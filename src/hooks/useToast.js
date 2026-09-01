"use client";

/**
 * useToast Custom Hook
 * Provides easy access to toast notification methods throughout the app
 */

import { useContext } from "react";
import { ToastContext } from "@/context/ToastContext";

/**
 * Custom hook to use toast notifications
 * Must be used within a ToastProvider
 *
 * @returns {object} Toast methods and state
 * @throws {Error} If used outside ToastProvider
 *
 * @example
 * const { showSuccess, showError } = useToast();
 *
 * showSuccess("Profile updated successfully");
 * showError("Failed to update profile");
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used within a ToastProvider. Make sure ToastProvider wraps your component."
    );
  }

  return context;
};

export default useToast;
