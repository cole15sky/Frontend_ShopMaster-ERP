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
  ChevronDown,
  ChevronRight,
  Settings,
  PlusCircle,
  List
} from "lucide-react";

// Define the structure for nested menu items
const menuData = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    title: "Operations",
    items: [
      {
        title: "Sales",
        icon: ShoppingCart,
        subItems: [
          { title: "All Orders", href: "/admin/sales" },
          { title: "Invoices", href: "/admin/sales/invoices" },
          { title: "POS Terminal", href: "/admin/sales/pos" },
        ]
      },
      {
        title: "Inventory",
        icon: Package,
        subItems: [
          { title: "Products", href: "/admin/inventory" },
          { title: "Stock Alert", href: "/admin/inventory/alerts" },
          { title: "Categories", href: "/admin/inventory/categories" },
        ]
      },
      {
        title: "QR Manager",
        icon: QrCode,
        subItems: [
          { title: "Generate QR", href: "/admin/qr/generate" },
          { title: "Scan History", href: "/admin/qr/history" },
        ]
      }
    ]
  },
  {
    title: "Finance & Data",
    items: [
      {
        title: "Payments",
        icon: CreditCard,
        subItems: [
          { title: "Transactions", href: "/admin/payments" },
          { title: "Gateways", href: "/admin/payments/gateways" },
          { title: "Refunds", href: "/admin/payments/refunds" },
        ]
      },
      {
        title: "Analytics",
        icon: BarChart3,
        subItems: [
          { title: "Revenue", href: "/admin/analytics/revenue" },
          { title: "Reports", href: "/admin/analytics/reports" },
        ]
      }
    ]
  },
  {
    title: "System",
    items: [
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800 shadow-xl">
      
      {/* Brand */}
      <div className="h-20 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Package size={22} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ERP<span className="text-indigo-500">Flux</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto py-4 space-y-6 scrollbar-hide">
        {menuData.map((section) => (
          <div key={section.title}>
            <h2 className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const hasSubItems = !!item.subItems;
                const isOpen = openMenus[item.title];
                const isActive = pathname === item.href || item.subItems?.some(sub => pathname === sub.href);

                return (
                  <div key={item.title}>
                    {hasSubItems ? (
                      /* Dropdown Trigger */
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group
                          ${isActive ? "text-white" : "hover:bg-slate-800/50 hover:text-white"}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"} />
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    ) : (
                      /* Standard Link */
                      <Link
                        href={item.href!}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all 
                          ${pathname === item.href ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "hover:bg-slate-800/50 hover:text-white"}`}
                      >
                        <Icon size={18} />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    )}

                    {/* Sub-menu Items */}
                    {hasSubItems && isOpen && (
                      <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-1 animate-in slide-in-from-top-1 duration-200">
                        {item.subItems!.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block px-3 py-2 text-xs rounded-md transition-colors
                              ${pathname === sub.href ? "text-indigo-400 font-semibold" : "text-slate-500 hover:text-white"}`}
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

      {/* Footer Profile */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Alex Rivera</p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}