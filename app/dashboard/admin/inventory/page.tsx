"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Plus, Package, AlertTriangle, BarChart3, Edit2, Trash2, X, Save, History } from "lucide-react";
import { useInventory } from "@/features/inventory/hooks";
import StockHistoryModal from "@/components/inventory/StockHistoryModal";
import type { Inventory } from "@/types/inventory";

function InventoryModal({
  item,
  onClose,
  onSave,
}: {
  item?: Inventory | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState({
    variant: item?.variant ?? 0,
    quantity: item?.quantity ?? 0,
    low_stock_alert: item?.low_stock_alert ?? 5,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
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
        <h2 className="text-xl font-bold text-white mb-6">
          {item ? "Edit Inventory" : "Add Inventory"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!item && (
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Variant ID</label>
              <input
                type="number"
                required
                value={form.variant}
                onChange={(e) => setForm({ ...form, variant: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Low Stock Alert Threshold</label>
            <input
              type="number"
              value={form.low_stock_alert}
              onChange={(e) => setForm({ ...form, low_stock_alert: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function InventoryPage() {
  const { inventory, loading, addInventory, editInventory, removeInventory, refresh } = useInventory();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Inventory | null>(null);
  const [historyItem, setHistoryItem] = useState<Inventory | null>(null);

  const lowStockCount = inventory.filter((i) => i.quantity <= i.low_stock_alert).length;
  const totalQty = inventory.reduce((sum, i) => sum + i.quantity, 0);

  const stats = [
    { label: "Total Items", value: inventory.length, icon: Package },
    { label: "Total Qty", value: totalQty, icon: BarChart3 },
    { label: "Low Stock", value: lowStockCount, icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex gap-3">
          <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => { setSelected(null); setOpen(true); }}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={18} /> Add Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Icon size={18} className="text-indigo-400" />
                <span className="text-sm text-slate-400">{s.label}</span>
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading inventory...</div>
        ) : inventory.length === 0 ? (
          <div className="p-10 text-center text-slate-400">No inventory records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-800">
                  <th className="p-4">Product</th>
                  <th className="p-4">Variant</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Alert At</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const isLow = item.quantity <= item.low_stock_alert;
                  return (
                    <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="p-4 font-medium">{item.product_name}</td>
                      <td className="p-4 text-slate-400 text-sm">{item.variant_name}</td>
                      <td className="p-4">
                        <span className={`font-bold ${isLow ? "text-red-400" : "text-green-400"}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{item.low_stock_alert}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-lg ${isLow ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                          {isLow ? "Low Stock" : "OK"}
                        </span>
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
                            onClick={() => { setSelected(item); setOpen(true); }}
                            className="text-slate-400 hover:text-white p-1"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => removeInventory(item.id)}
                            className="text-slate-400 hover:text-red-400 p-1"
                          >
                            <Trash2 size={15} />
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
        {open && (
          <InventoryModal
            item={selected}
            onClose={() => setOpen(false)}
            onSave={selected ? (data) => editInventory(selected.id, data) : addInventory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
