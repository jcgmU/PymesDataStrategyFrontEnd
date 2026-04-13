"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LogoMark } from "@/components/ui";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/review");
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#1a1a1a] hidden md:flex flex-col z-10">
      {/* Logo */}
      <div className="p-6 border-b border-[#334155]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <LogoMark size={32} color="#ff6600" />
          <span className="text-white font-bold text-lg tracking-tight">PYMES-AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150",
                active
                  ? "bg-[#ff6600] text-white"
                  : "text-[#94a3b8] hover:bg-[#2d2d2d] hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Cerrar Sesión */}
      <div className="border-t border-[#334155] p-3">
        {user && (
          <div className="flex items-center gap-2 px-2 py-2 mb-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#ff6600] text-white font-bold text-sm flex items-center justify-center shrink-0">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-[#94a3b8] truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#94a3b8] hover:bg-[#ef444420] hover:text-[#f87171] transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
