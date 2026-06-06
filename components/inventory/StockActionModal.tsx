"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal } from "lucide-react";
import type { Unit, Inventory } from "@/types/inventory";

export type StockAction = "in" | "out" | "adjust";

const UNITS: Unit[] = ["PCS", "KG", "G", "L", "BOX", "PACK"];

const META: Record<StockAction, { title: string; icon: any; verb: string; accent: string }> = {
  in: { title: "Stock In", icon: ArrowDownToLine, verb: "Add stock", accent: "text-green-400" },
  out: { title: "Stock Out", icon: ArrowUpFromLine, verb: "Remove stock", accent: "text-red-400" },
  adjust: { title: "Stock Adjustment", icon: SlidersHorizontal, verb: "Set new quantity", accent: "text-amber-400" },
};

type Props = {
  action: StockAction;
  item: Inventory;
  onClose: () => void;
  onSubmit: (payload: {
    variant_id: number;
    quantity?: number;
    new_quantity?: number;
    unit: Unit;
    note?: string;
  }) => Promise<unknown>;
};

export default function StockActionModal({ action, item, onClose, onSubmit }: Props) {
  const meta = META[action];
  const Icon = meta.icon;
  const [amount, setAmount] = useState<number>(action === "adjust" ? item.quantity : 1);
  const [unit, setUnit] = useState<Unit>("PCS");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const base = { variant_id: item.variant, unit, note: note || undefined };
      await onSubmit(
        action === "adjust"
          ? { ...base, new_quantity: amount }
          : { ...base, quantity: amount }
      );
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;
      setError(
        data?.detail ||
          (data && typeof data === "object" ? Object.values(data).flat().join(" ") : "") ||
          "Stock operation failed."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md mx-4 bg-slate-950 border border-slate-800 rounded-2xl p-6"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Icon size={20} className={meta.accent} />
          <h2 className="text-xl font-bold text-white">{meta.title}</h2>
        </div>
        <p className="text-slate-500 text-sm mb-5">
          {item.product_name} — {item.variant_name} · current: <span className="text-slate-300">{item.quantity}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">
                {action === "adjust" ? "New Quantity" : "Quantity"}
              </label>
              <input
                type="number"
                required
                min={action === "adjust" ? 0 : 1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={action === "in" ? "restock" : action === "out" ? "sold" : "audit correction"}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : meta.verb}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
