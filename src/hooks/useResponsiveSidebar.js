"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";

const MOBILE_BREAKPOINT = 860;

// Syncs appStore.isMobile with the viewport, matching the design's collapse
// breakpoint — below 860px the sidebar becomes a fixed overlay drawer that
// starts collapsed.
export function useResponsiveSidebar() {
  const setIsMobile = useAppStore((state) => state.setIsMobile);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);
}
