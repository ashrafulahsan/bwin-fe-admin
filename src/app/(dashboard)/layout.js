import DashboardLayout from "@/layouts/DashboardLayout";

// Dashboard route group layout. Business logic belongs in modules, not here.
export default function DashboardGroupLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
