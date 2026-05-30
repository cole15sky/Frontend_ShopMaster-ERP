"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context";
import { getProducts } from "@/features/products/api";
import { getInventory } from "@/features/inventory/api";
import { getVariants } from "@/features/variants/api";
import {
  Package, Boxes, AlertTriangle, BarChart3,
  ArrowRight, TrendingDown,
} from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { Inventory } from "@/types/inventory";

type Stats = {
  products: number;
  variants: number;
  totalStock: number;
  lowStock: number;
  outOfStock: number;
};

export default function StaffDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [lowStockItems, setLowStockItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getInventory(), getVariants()])
      .then(([products, inventory, variants]) => {
        const p = products as Product[];
        const inv = inventory as Inventory[];
        const low = inv.filter((i) => i.quantity <= i.low_stock_alert);

        setStats({
          products: p.length,
          variants: (variants as any[]).length,
          totalStock: inv.reduce((s, i) => s + i.quantity, 0),
          lowStock: low.length,
          outOfStock: inv.filter((i) => i.quantity === 0).length,
        });
        setLowStockItems(low.slice(0, 6));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Total Products", value: stats.products, icon: Package, color: "text-indigo-400", bg: "border-indigo-500/20 bg-indigo-500/5" },
        { label: "Total Variants", value: stats.variants, icon: Boxes, color: "text-purple-400", bg: "border-purple-500/20 bg-purple-500/5" },
        { label: "Stock Units", value: stats.totalStock.toLocaleString(), icon: BarChart3, color: "text-green-400", bg: "border-green-500/20 bg-green-500/5" },
        { label: "Low Stock Alerts", value: stats.lowStock, icon: AlertTriangle, color: "text-red-400", bg: "border-red-500/20 bg-red-500/5" },
      ]
    : [];

  const quickLinks = [
    { label: "Stock Management", href: "/dashboard/staff/inventory", icon: Boxes, desc: "Update stock quantities" },
    { label: "Browse Products", href: "/dashboard/staff/products", icon: Package, desc: "View product catalog" },
    { label: "QR Codes", href: "/dashboard/staff/qr", icon: BarChart3, desc: "Scan & download QR codes" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Good day, <span className="text-indigo-400">{user?.full_name ?? user?.email}</span>
        </h1>
        <p className="text-slate-400 mt-1">Here's your operational overview.</p>
      </div>

      {/* STATS */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`bg-slate-900 border ${s.bg} rounded-2xl p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-sm">{s.label}</span>
                  <Icon size={16} className={s.color} />
                </div>
                <p className="text-3xl font-black">{s.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QUICK ACCESS */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-slate-300">Quick Access</h2>
          <div className="space-y-3">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link
                  key={i}
                  href={link.href}
                  className="group flex items-center justify-between bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                      <Icon size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{link.label}</p>
                      <p className="text-xs text-slate-500">{link.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* LOW STOCK ALERTS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-300">Low Stock Alerts</h2>
            <Link href="/dashboard/staff/inventory" className="text-xs text-indigo-400 hover:text-indigo-300">
              View all →
            </Link>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading...</div>
            ) : lowStockItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-green-400 font-semibold text-sm">All stock levels OK</p>
                <p className="text-slate-500 text-xs mt-1">No items below alert threshold.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.product_name}</p>
                      <p className="text-xs text-slate-500">{item.variant_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown size={14} className="text-red-400" />
                      <span className={`text-sm font-bold ${item.quantity === 0 ? "text-red-400" : "text-yellow-400"}`}>
                        {item.quantity} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
