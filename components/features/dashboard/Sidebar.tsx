"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

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
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/review");
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r-4 border-black hidden md:flex flex-col shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] z-10">
      {/* Logo */}
      <div className="p-6 border-b-4 border-black">
        <Link href="/dashboard">
          <h1 className="text-2xl font-black uppercase leading-tight">
            Data<br />
            <span className="text-[#FF6B00]">Strategy</span>
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 font-bold px-4 py-3 border-2 transition-all",
                active &&
                  "bg-[#FF6B00] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1",
                !active &&
                  "border-transparent hover:border-black"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Cerrar Sesión */}
      <div className="p-4 border-t-4 border-black">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 font-bold px-4 py-3 border-2 border-black bg-white hover:bg-red-50 text-red-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
