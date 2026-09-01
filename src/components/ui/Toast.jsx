"use client";

/**
 * Toast Component
 * Main wrapper component that renders toast notifications
 * Should be placed in the root layout
 */

import React, { useContext } from "react";
import ToastContainer from "./ToastContainer";
import { ToastContext } from "@/context/ToastContext";

/**
 * Toast Component
 * Renders all active toast notifications
 * Place this in your root layout or app wrapper
 *
 * @example
 * // In src/app/layout.jsx
 * import Toast from '@/components/ui/Toast';
 * import ToastProvider from '@/context/ToastContext';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <ToastProvider>
 *       {children}
 *       <Toast />
 *     </ToastProvider>
 *   );
 * }
 */
export const Toast = () => {
  const context = useContext(ToastContext);

  // Toast should be safe to render without context
  // (won't throw error if used outside ToastProvider)
  if (!context) {
    return null;
  }

  const { toasts, removeToast, position } = context;

  return (
    <ToastContainer toasts={toasts} onRemove={removeToast} position={position} />
  );
};

export default Toast;
