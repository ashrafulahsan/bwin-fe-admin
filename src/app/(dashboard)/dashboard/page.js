"use client";

import { useAuthStore } from "@/store/authStore";
import DashboardOverview from "@/modules/dashboard/components/DashboardOverview";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const greetingName = user?.full_name || user?.email || "Admin";

  return <DashboardOverview greetingName={greetingName} />;
}
