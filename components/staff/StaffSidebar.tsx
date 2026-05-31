"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context";
import {
  LayoutDashboard,
  Package,
  Boxes,
  QrCode,
  Settings,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

type SubItem = { title: string; href: string };
type MenuItem = { title: string; href?: string; icon?: any; subItems?: SubItem[] };
type MenuSection = { title: string; items: MenuItem[] };

const menuData: MenuSection[] = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard/staff", icon: LayoutDashboard },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Products",
        icon: Package,
        subItems: [
          { title: "Browse Products", href: "/dashboard/staff/products" },
          { title: "Variants", href: "/dashboard/staff/variants" },
        ],
      },
      {
        title: "Inventory",
        icon: Boxes,
        subItems: [
          { title: "Stock Management", href: "/dashboard/staff/inventory" },
        ],
      },
      {
        title: "QR Manager",
        href: "/dashboard/staff/qr",
        icon: QrCode,
      },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Settings", href: "/dashboard/staff/settings", icon: Settings },
    ],
  },
];

export default function StaffSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800">
      {/* BRAND */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div>
          <p className="text-white font-bold text-lg">
            Shop<span className="text-indigo-400">Master</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Staff Portal</p>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {menuData.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs uppercase text-slate-500 mb-2 px-2">{section.title}</h2>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const hasSubItems = !!item.subItems?.length;
                const isOpen = openMenus[item.title];
                const isActive =
                  pathname === item.href ||
                  item.subItems?.some((sub) => sub.href === pathname);

                return (
                  <div key={item.title}>
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                          isActive ? "text-white bg-slate-800" : "hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon size={18} className="text-slate-400" />}
                          <span className="text-sm">{item.title}</span>
                        </div>
                        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    ) : (
                      <Link
                        href={item.href!}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                          pathname === item.href ? "bg-indigo-600 text-white" : "hover:bg-slate-800/50"
                        }`}
                      >
                        {Icon && <Icon size={18} />}
                        {item.title}
                      </Link>
                    )}

                    {hasSubItems && isOpen && (
                      <div className="ml-6 mt-1 pl-3 border-l border-slate-700 space-y-1">
                        {(item.subItems ?? []).map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block text-sm px-2 py-1 rounded transition ${
                              pathname === sub.href
                                ? "text-indigo-400 font-semibold"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* USER FOOTER */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
            <User size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.full_name ?? user?.email}</p>
            <p className="text-xs text-slate-500">Staff</p>
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
