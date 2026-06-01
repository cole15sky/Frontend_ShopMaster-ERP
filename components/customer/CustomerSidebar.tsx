"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context";
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Settings,
  LogOut,
  User,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
  { title: "Browse Products", href: "/dashboard/customer/products", icon: Package },
  { title: "Free Trial", href: "/trial", icon: Sparkles },
  { title: "Settings", href: "/dashboard/customer/settings", icon: Settings },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800">
      {/* BRAND */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div>
          <p className="text-white font-bold text-lg">
            Shop<span className="text-indigo-400">Master</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Customer Portal</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isTrial = item.href === "/trial";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : isTrial
                  ? "text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/20"
                  : "hover:bg-slate-800/50 text-slate-300"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : isTrial ? "text-indigo-400" : "text-slate-400"} />
              {item.title}
              {isTrial && (
                <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
                  Free
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* USER FOOTER */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
            <User size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.full_name ?? user?.email}</p>
            <p className="text-xs text-slate-500">Customer</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
