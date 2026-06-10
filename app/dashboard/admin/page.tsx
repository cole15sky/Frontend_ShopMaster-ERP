"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context";
import { getProducts } from "@/features/products/api";
import { getInventory } from "@/features/inventory/api";
import { getUsers } from "@/features/users/api";
import { getVariants } from "@/features/variants/api";
import {
  Package, Users, BarChart3, AlertTriangle,
  TrendingUp, ShoppingCart, Boxes, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { Inventory } from "@/types/inventory";
import type { User } from "@/types/user";

type Stats = {
  products: number;
  activeProducts: number;
  users: number;
  inventory: number;
  lowStock: number;
  variants: number;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getInventory(), getUsers(), getVariants()])
      .then(([products, inventory, users, variants]) => {
        const p = products as Product[];
        const inv = inventory as Inventory[];
        const u = users as User[];
        setStats({
          products: p.length,
          activeProducts: p.filter((x) => x.status === "ACTIVE").length,
          users: u.length,
          inventory: inv.reduce((s, i) => s + i.quantity, 0),
          lowStock: inv.filter((i) => i.quantity <= i.low_stock_alert).length,
          variants: (variants as any[]).length,
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Total Products", value: stats.products, sub: `${stats.activeProducts} active`, icon: Package, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
        { label: "Total Variants", value: stats.variants, sub: "SKUs tracked", icon: Boxes, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
        { label: "Total Users", value: stats.users, sub: "registered accounts", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
        { label: "Stock Units", value: stats.inventory, sub: "across all variants", icon: BarChart3, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
        { label: "Low Stock Alerts", value: stats.lowStock, sub: "items need restock", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
        { label: "Active Products", value: stats.activeProducts, sub: `of ${stats.products} total`, icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
      ]
    : [];

  const quickLinks = [
    { label: "Add Product", href: "/dashboard/admin/products", icon: Package, desc: "Create new product with variants" },
    { label: "Manage Inventory", href: "/dashboard/admin/inventory", icon: Boxes, desc: "Update stock quantities" },
    { label: "View Users", href: "/dashboard/admin/users", icon: Users, desc: "Manage user accounts" },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3, desc: "Business insights" },
    { label: "Categories", href: "/dashboard/admin/inventory/categories", icon: ShoppingCart, desc: "Product categories" },
    { label: "QR Manager", href: "/dashboard/admin/qr/generate", icon: ShoppingCart, desc: "Generate & scan QR codes" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Welcome back, <span className="text-indigo-400">{user?.full_name ?? user?.email}</span>
        </h1>
        <p className="text-slate-400 mt-1">Here's what's happening in your ERP today.</p>
      </div>

      {/* STAT CARDS */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`bg-slate-900 border border-slate-800 rounded-2xl p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-sm">{s.label}</span>
                  <div className={`p-2 rounded-xl border ${s.bg}`}>
                    <Icon size={16} className={s.color} />
                  </div>
                </div>
                <p className="text-3xl font-black">{s.value.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-4 mb-8 text-red-400 text-sm">
          Failed to load dashboard stats. Check API connectivity.
        </div>
      )}

      {/* QUICK LINKS */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-slate-300">Quick Access</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link
                key={i}
                href={link.href}
                className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all hover:bg-slate-800/60"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <Icon size={18} className="text-indigo-400" />
                  </div>
                  <ArrowRight size={16} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="font-semibold text-sm">{link.label}</p>
                <p className="text-xs text-slate-500 mt-1">{link.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
