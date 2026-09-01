"use client";

/**
 * ToastContainer Component
 * Manages multiple toast notifications in a queue
 */

import React, { useState, useCallback } from "react";
import ToastItem from "./ToastItem";
import {
  CONTAINER_POSITION_CLASSES,
  TOAST_POSITIONS,
} from "@/constants/toastTypes";

/**
 * ToastContainer Component
 * Displays and manages multiple toast notifications
 */
export const ToastContainer = ({ toasts, onRemove, position }) => {
  const [exitingToastIds, setExitingToastIds] = useState(new Set());

  /**
   * Handle toast close with exit animation
   */
  const handleClose = useCallback(
    (toastId) => {
      setExitingToastIds((prev) => new Set(prev).add(toastId));

      // Remove after animation completes
      setTimeout(() => {
        onRemove(toastId);
        setExitingToastIds((prev) => {
          const next = new Set(prev);
          next.delete(toastId);
          return next;
        });
      }, 300);
    },
    [onRemove]
  );

  // Determine if toasts should be displayed in reverse order
  const isTopPosition = position?.includes("top");
  const displayToasts = isTopPosition ? toasts : [...toasts].reverse();

  const containerClasses = CONTAINER_POSITION_CLASSES[position] || "top-0 right-0";

  return (
    <div
      className={`
        fixed ${containerClasses}
        z-9999 pointer-events-none
        p-4 sm:p-6 md:p-8
      `}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        {displayToasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => handleClose(toast.id)}
            isExiting={exitingToastIds.has(toast.id)}
            position={position}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
