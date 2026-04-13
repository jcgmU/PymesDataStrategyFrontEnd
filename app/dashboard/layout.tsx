import { type ReactNode } from "react";
import { Sidebar } from "@/components/features/dashboard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <Sidebar />
      {children}
    </div>
  );
}
