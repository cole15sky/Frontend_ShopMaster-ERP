"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, RefreshCcw, Boxes, X, CheckCircle, XCircle } from "lucide-react";
import { getVariants } from "@/features/variants/api";
import type { ProductVariant } from "@/types/product";

export default function StaffVariantsPage() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("All");

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const data = await getVariants();
      setVariants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVariants(); }, []);

  const sizes = useMemo(() => {
    const s = new Set(variants.map((v) => v.size));
    return ["All", ...Array.from(s).sort()];
  }, [variants]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return variants.filter((v) => {
      const matchSearch =
        v.sku.toLowerCase().includes(q) ||
        (v.color ?? "").toLowerCase().includes(q) ||
        (v.barcode ?? "").toLowerCase().includes(q);
      const matchSize = sizeFilter === "All" || v.size === sizeFilter;
      return matchSearch && matchSize;
    });
  }, [variants, search, sizeFilter]);

  const activeCount = variants.filter((v) => v.is_active).length;

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Variants</h1>
          <p className="text-slate-400 text-sm mt-1">
            {variants.length} variants · {activeCount} active
          </p>
        </div>
        <button onClick={fetchVariants} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl flex-1">
          <Search size={16} className="text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, color, barcode..."
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-slate-600"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSizeFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                sizeFilter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading variants...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Boxes size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400">No variants found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-800">
                  <th className="p-4">SKU</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Color</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Barcode</th>
                  <th className="p-4">Active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-sm text-indigo-300">{v.sku}</td>
                    <td className="p-4 text-sm">
                      <span className="px-2 py-1 bg-slate-800 rounded-lg text-slate-300">{v.size}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{v.gender}</td>
                    <td className="p-4 text-sm text-slate-400">{v.color || "—"}</td>
                    <td className="p-4 font-semibold text-white">${v.price}</td>
                    <td className="p-4 text-sm text-green-400">
                      {v.discount_price ? `$${v.discount_price}` : "—"}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">{v.barcode || "—"}</td>
                    <td className="p-4">
                      {v.is_active
                        ? <CheckCircle size={16} className="text-green-400" />
                        : <XCircle size={16} className="text-slate-600" />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
