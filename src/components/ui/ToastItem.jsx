"use client";

/**
 * ToastItem Component
 * Individual toast notification component with animation and interactions
 */

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Ban,
  X,
} from "lucide-react";
import { getToastConfig } from "@/utils/toastHelpers";

/**
 * Icon mapping for toast types
 */
const ICON_MAP = {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Ban,
};

/**
 * ToastItem Component
 * Displays a single toast notification with progress bar
 */
export const ToastItem = ({
  toast,
  onClose,
  isExiting = false,
  position = "top-right",
}) => {
  const [timeLeft, setTimeLeft] = useState(toast.duration);
  const [isHovered, setIsHovered] = useState(false);
  const config = getToastConfig(toast.type);
  const IconComponent = ICON_MAP[config.icon];

  // Progress bar effect
  useEffect(() => {
    if (toast.duration <= 0) return; // No auto-dismiss

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const remaining = prev - 50;
        return remaining <= 0 ? 0 : remaining;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [toast.duration]);

  // Auto-dismiss when time is up
  useEffect(() => {
    if (timeLeft === 0 && !isHovered && toast.duration > 0) {
      const timer = setTimeout(onClose, 300); // Allow exit animation
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isHovered, toast.duration, onClose]);

  const progressPercent = (timeLeft / toast.duration) * 100;

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
        mb-3
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`
          flex items-start gap-3 rounded-lg border
          p-4 shadow-lg backdrop-blur-sm
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          ${config.darkBgColor} ${config.darkBorderColor} ${config.darkTextColor}
          hover:shadow-xl transition-shadow duration-200
        `}
      >
        {/* Icon */}
        <div className="shrink-0 pt-0.5">
          {IconComponent && (
            <IconComponent
              className={`h-5 w-5 ${config.iconColor}`}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {toast.title && (
            <p className="font-semibold text-sm mb-1">{toast.title}</p>
          )}

          {/* Message */}
          {toast.message && (
            <p className="text-sm opacity-90 break-word">{toast.message}</p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`
            shrink-0 p-1 rounded-md
            transition-colors duration-200
            hover:bg-black/10 dark:hover:bg-white/10
            focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-offset-transparent
          `}
          aria-label="Close notification"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar */}
      {toast.duration > 0 && (
        <div
          className={`
            h-1 mt-1 rounded-full
            ${config.progressColor} opacity-60
            transition-all duration-75 ease-linear
          `}
          style={{
            width: `${progressPercent}%`,
          }}
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Auto-dismiss progress"
        />
      )}
    </div>
  );
};

export default ToastItem;
