"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCcw, Search, AlertTriangle, Boxes, BarChart3,
  Edit2, X, Save, History, TrendingUp, TrendingDown,
} from "lucide-react";
import { useInventory } from "@/features/inventory/hooks";
import StockHistoryModal from "@/components/inventory/StockHistoryModal";
import type { Inventory } from "@/types/inventory";

function EditStockModal({
  item,
  onClose,
  onSave,
}: {
  item: Inventory;
  onClose: () => void;
  onSave: (data: { quantity: number; low_stock_alert: number }) => Promise<void>;
}) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [alert, setAlert] = useState(item.low_stock_alert);
  const [saving, setSaving] = useState(false);

  const diff = quantity - item.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ quantity, low_stock_alert: alert });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md mx-4 bg-slate-950 border border-slate-800 rounded-2xl p-6"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Update Stock</h2>
          <p className="text-slate-400 text-sm mt-1">{item.product_name}</p>
          <p className="text-slate-500 text-xs">{item.variant_name}</p>
        </div>

        {/* CURRENT QTY BADGE */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 mb-5">
          <Boxes size={16} className="text-slate-400" />
          <span className="text-sm text-slate-400">Current stock:</span>
          <span className="font-bold text-white">{item.quantity}</span>
          {diff !== 0 && (
            <span className={`ml-auto text-sm font-bold flex items-center gap-1 ${diff > 0 ? "text-green-400" : "text-red-400"}`}>
              {diff > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {diff > 0 ? "+" : ""}{diff}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">New Quantity</label>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 text-lg font-bold"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Low Stock Alert Threshold</label>
            <input
              type="number"
              min={0}
              value={alert}
              onChange={(e) => setAlert(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Update Stock"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function StaffInventoryPage() {
  const { inventory, loading, editInventory, refresh } = useInventory();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Low" | "Out">("All");
  const [editing, setEditing] = useState<Inventory | null>(null);
  const [historyItem, setHistoryItem] = useState<Inventory | null>(null);

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch =
        item.product_name.toLowerCase().includes(search.toLowerCase()) ||
        item.variant_name.toLowerCase().includes(search.toLowerCase());
      const isLow = item.quantity <= item.low_stock_alert;
      const isOut = item.quantity === 0;
      const matchFilter =
        filter === "All" ||
        (filter === "Low" && isLow && !isOut) ||
        (filter === "Out" && isOut);
      return matchSearch && matchFilter;
    });
  }, [inventory, search, filter]);

  const lowCount = inventory.filter((i) => i.quantity > 0 && i.quantity <= i.low_stock_alert).length;
  const outCount = inventory.filter((i) => i.quantity === 0).length;
  const totalStock = inventory.reduce((s, i) => s + i.quantity, 0);

  const stats = [
    { label: "Total Items", value: inventory.length, icon: Boxes, color: "text-indigo-400" },
    { label: "Total Stock", value: totalStock.toLocaleString(), icon: BarChart3, color: "text-green-400" },
    { label: "Low Stock", value: lowCount, icon: AlertTriangle, color: "text-yellow-400" },
    { label: "Out of Stock", value: outCount, icon: TrendingDown, color: "text-red-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <p className="text-slate-400 text-sm mt-1">Update and monitor inventory levels.</p>
        </div>
        <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={s.color} />
                <span className="text-slate-400 text-xs">{s.label}</span>
              </div>
              <p className="text-2xl font-black">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl flex-1">
          <Search size={16} className="text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product or variant..."
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-slate-600"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(["All", "Low", "Out"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === f
                  ? f === "Out" ? "bg-red-600 text-white"
                    : f === "Low" ? "bg-yellow-600 text-white"
                    : "bg-indigo-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {f === "All" ? "All" : f === "Low" ? `Low (${lowCount})` : `Out (${outCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading inventory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Boxes size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400">{search || filter !== "All" ? "No matching records." : "No inventory records."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-800">
                  <th className="p-4">Product</th>
                  <th className="p-4">Variant</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Alert</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const isOut = item.quantity === 0;
                  const isLow = !isOut && item.quantity <= item.low_stock_alert;
                  return (
                    <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="p-4 font-medium text-sm">{item.product_name}</td>
                      <td className="p-4 text-slate-400 text-sm">{item.variant_name}</td>
                      <td className="p-4">
                        <span className={`text-lg font-black ${isOut ? "text-red-400" : isLow ? "text-yellow-400" : "text-green-400"}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-sm">{item.low_stock_alert}</td>
                      <td className="p-4">
                        {isOut ? (
                          <span className="px-2 py-1 text-xs rounded-lg bg-red-500/20 text-red-400">Out of Stock</span>
                        ) : isLow ? (
                          <span className="px-2 py-1 text-xs rounded-lg bg-yellow-500/20 text-yellow-400">Low Stock</span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-lg bg-green-500/20 text-green-400">OK</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setHistoryItem(item)}
                            className="text-slate-400 hover:text-indigo-400 p-1"
                            title="Stock history"
                          >
                            <History size={15} />
                          </button>
                          <button
                            onClick={() => setEditing(item)}
                            className="text-slate-400 hover:text-white p-1"
                            title="Update stock"
                          >
                            <Edit2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {historyItem && (
        <StockHistoryModal
          variantId={historyItem.variant}
          variantName={`${historyItem.product_name} — ${historyItem.variant_name}`}
          onClose={() => setHistoryItem(null)}
        />
      )}

      <AnimatePresence>
        {editing && (
          <EditStockModal
            item={editing}
            onClose={() => setEditing(null)}
            onSave={(data) => editInventory(editing.id, data)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
