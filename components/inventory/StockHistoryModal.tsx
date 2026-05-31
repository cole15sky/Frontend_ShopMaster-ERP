"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, History, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getVariantStockHistory } from "@/features/stock-history/api";
import type { StockHistory, StockHistoryEntry } from "@/types/inventory";

type Props = {
  variantId: number;
  variantName: string;
  onClose: () => void;
};

export default function StockHistoryModal({ variantId, variantName, onClose }: Props) {
  const [data, setData] = useState<StockHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getVariantStockHistory(variantId)
      .then(setData)
      .catch(() => setError("Failed to load stock history."))
      .finally(() => setLoading(false));
  }, [variantId]);

  const getChangeIcon = (entry: StockHistoryEntry) => {
    const change = Number(entry.quantity_change ?? entry.change ?? 0);
    if (change > 0) return <TrendingUp size={14} className="text-green-400" />;
    if (change < 0) return <TrendingDown size={14} className="text-red-400" />;
    return <Minus size={14} className="text-slate-500" />;
  };

  const getChangeColor = (entry: StockHistoryEntry) => {
    const change = Number(entry.quantity_change ?? entry.change ?? 0);
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-slate-400";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg mx-4 bg-slate-950 border border-slate-800 rounded-2xl p-6 max-h-[80vh] flex flex-col"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <History size={18} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Stock History</h2>
            <p className="text-xs text-slate-400">{variantName}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-slate-900 rounded-xl h-12 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-400 text-sm text-center py-8">{error}</p>
          ) : !data || data.history.length === 0 ? (
            <div className="text-center py-10">
              <History size={36} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No stock history recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.history.map((entry: StockHistoryEntry, i: number) => (
                <div key={i} className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    {getChangeIcon(entry)}
                    <div>
                      <p className="text-sm text-white">{entry.reason ?? entry.type ?? "Stock update"}</p>
                      <p className="text-xs text-slate-500">
                        {entry.created_at ?? entry.date ?? entry.timestamp ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${getChangeColor(entry)}`}>
                      {Number(entry.quantity_change ?? entry.change ?? 0) > 0 ? "+" : ""}
                      {entry.quantity_change ?? entry.change ?? 0}
                    </p>
                    {(entry.quantity_after ?? entry.new_quantity) && (
                      <p className="text-xs text-slate-500">
                        → {entry.quantity_after ?? entry.new_quantity}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
