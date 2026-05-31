"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  CreditCard,
  QrCode,
  ShoppingCart,
  Settings,
  ChevronDown,
} from "lucide-react";

/* =========================
   TYPES (FIXED)
========================= */

type SubItem = {
  title: string;
  href: string;
};

type MenuItem = {
  title: string;
  href?: string;
  icon?: any;
  subItems?: SubItem[];
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

/* =========================
   MENU DATA
========================= */

const menuData: MenuSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Sales",
        icon: ShoppingCart,
        subItems: [
          { title: "All Orders", href: "/dashboard/admin/sales" },
          { title: "Invoices", href: "/dashboard/admin/sales/invoices" },
          { title: "POS Terminal", href: "/dashboard/admin/sales/pos" },
        ],
      },
      {
        title: "Inventory",
        icon: Package,
        subItems: [
          { title: "Products", href: "/dashboard/admin/products" },
          { title: "Variants", href: "/dashboard/admin/inventory/variants" },
          { title: "Inventory", href: "/dashboard/admin/inventory" },
          { title: "Categories", href: "/dashboard/admin/inventory/categories" },
          { title: "Brands", href: "/dashboard/admin/inventory/brands" },
        ],
      },
      {
        title: "QR Manager",
        icon: QrCode,
        subItems: [
          { title: "Generate QR", href: "/dashboard/admin/qr/generate" },
          { title: "Scan History", href: "/dashboard/admin/qr/history" },
        ],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Users",
        href: "/dashboard/admin/users",
        icon: Users,
        subItems: [
          { title: "All Users", href: "/dashboard/admin/users" },
        ],
      },
      {
        title: "Analytics",
        href: "/dashboard/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Payments",
        href: "/dashboard/admin/payments",
        icon: CreditCard,
      },
      {
        title: "Settings",
        href: "/dashboard/admin/settings",
        icon: Settings,
      },
    ],
  },
];

/* =========================
   COMPONENT
========================= */

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className="w-64 h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800">

      {/* BRAND */}
      <div className="h-20 flex items-center px-6 text-white font-bold text-xl">
        ERP<span className="text-indigo-500">Flux</span>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">

        {menuData.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs uppercase text-slate-500 mb-2 px-2">
              {section.title}
            </h2>

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

                    {/* MAIN ITEM */}
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition
                          ${isActive ? "text-white bg-slate-800" : "hover:bg-slate-800/50"}`}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && (
                            <Icon
                              size={18}
                              className="text-slate-400"
                            />
                          )}
                          <span className="text-sm">{item.title}</span>
                        </div>

                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href!}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                          ${pathname === item.href ? "bg-indigo-600 text-white" : "hover:bg-slate-800/50"}`}
                      >
                        {Icon && <Icon size={18} />}
                        {item.title}
                      </Link>
                    )}

                    {/* SUB ITEMS (FIXED SAFE MAP) */}
                    {hasSubItems && isOpen && (
                      <div className="ml-6 mt-1 pl-3 border-l border-slate-700 space-y-1">

                        {(item.subItems ?? []).map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block text-sm px-2 py-1 rounded transition
                              ${pathname === sub.href
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

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800 text-sm text-slate-400">
        Admin Panel
      </div>

    </aside>
  );
}