"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/features/products/api";
import { getInventory } from "@/features/inventory/api";
import { getUsers } from "@/features/users/api";
import { getVariants } from "@/features/variants/api";
import { BarChart3, Package, Users, Boxes, TrendingUp, AlertTriangle } from "lucide-react";
import type { Product } from "@/types/product";
import type { Inventory } from "@/types/inventory";
import type { User } from "@/types/user";

type AnalyticsData = {
  products: Product[];
  inventory: Inventory[];
  users: User[];
  variants: any[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getInventory(), getUsers(), getVariants()])
      .then(([products, inventory, users, variants]) => {
        setData({ products: products as Product[], inventory: inventory as Inventory[], users: users as User[], variants: variants as any[] });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C14] text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { products, inventory, users, variants } = data;

  /* ── derived stats ── */
  const activeProducts = products.filter((p) => p.status === "Active").length;
  const inactiveProducts = products.length - activeProducts;
  const totalStock = inventory.reduce((s, i) => s + i.quantity, 0);
  const lowStockItems = inventory.filter((i) => i.quantity <= i.low_stock_alert);
  const outOfStock = inventory.filter((i) => i.quantity === 0);
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const staffCount = users.filter((u) => u.role === "STAFF").length;
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;

  /* ── category distribution ── */
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => {
    const key = p.category?.name ?? "Uncategorised";
    categoryMap[key] = (categoryMap[key] ?? 0) + 1;
  });
  const categoryEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxCategoryCount = Math.max(...categoryEntries.map(([, v]) => v), 1);

  /* ── brand distribution ── */
  const brandMap: Record<string, number> = {};
  products.forEach((p) => {
    const key = p.brand?.name ?? "No Brand";
    brandMap[key] = (brandMap[key] ?? 0) + 1;
  });
  const brandEntries = Object.entries(brandMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const kpis = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-indigo-400" },
    { label: "Active Products", value: activeProducts, icon: TrendingUp, color: "text-green-400" },
    { label: "Total Variants", value: variants.length, icon: Boxes, color: "text-purple-400" },
    { label: "Stock Units", value: totalStock.toLocaleString(), icon: BarChart3, color: "text-cyan-400" },
    { label: "Low Stock Alerts", value: lowStockItems.length, icon: AlertTriangle, color: "text-red-400" },
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6 space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Icon size={18} className={k.color} />
                <span className="text-slate-400 text-sm">{k.label}</span>
              </div>
              <p className="text-3xl font-black">{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* PRODUCTS BY CATEGORY */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5">Products by Category</h2>
          {categoryEntries.length === 0 ? (
            <p className="text-slate-500 text-sm">No data.</p>
          ) : (
            <div className="space-y-3">
              {categoryEntries.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{name}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* USER BREAKDOWN */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5">User Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: "Admins", count: adminCount, color: "bg-purple-500" },
              { label: "Staff", count: staffCount, color: "bg-blue-500" },
              { label: "Customers", count: customerCount, color: "bg-green-500" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${row.color}`} />
                <span className="text-slate-300 text-sm flex-1">{row.label}</span>
                <span className="text-white font-bold">{row.count}</span>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color} rounded-full`}
                    style={{ width: users.length ? `${(row.count / users.length) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-red-400">{outOfStock.length}</p>
              <p className="text-xs text-slate-400 mt-1">Out of Stock</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-yellow-400">{lowStockItems.length}</p>
              <p className="text-xs text-slate-400 mt-1">Low Stock</p>
            </div>
          </div>
        </div>

        {/* BRAND DISTRIBUTION */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5">Products by Brand</h2>
          {brandEntries.length === 0 ? (
            <p className="text-slate-500 text-sm">No brand data.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {brandEntries.map(([name, count]) => (
                <div key={name} className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-slate-300 truncate">{name}</span>
                  <span className="text-indigo-400 font-bold text-sm ml-2">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INVENTORY STATUS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5">Inventory Status</h2>
          {inventory.length === 0 ? (
            <p className="text-slate-500 text-sm">No inventory records.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {inventory
                .sort((a, b) => a.quantity - b.quantity)
                .slice(0, 10)
                .map((item) => {
                  const isLow = item.quantity <= item.low_stock_alert;
                  return (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                      <div>
                        <p className="text-sm text-white">{item.product_name}</p>
                        <p className="text-xs text-slate-500">{item.variant_name}</p>
                      </div>
                      <span className={`text-sm font-bold ${isLow ? "text-red-400" : "text-green-400"}`}>
                        {item.quantity}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
