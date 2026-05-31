"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Search, Edit2, Trash2, X, Save, Boxes, CheckCircle, XCircle } from "lucide-react";
import { getVariants, updateVariant, deleteVariant } from "@/features/variants/api";
import type { ProductVariant, Gender, Size } from "@/types/product";

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDERS: Gender[] = ["Male", "Female", "Unisex"];

function EditVariantModal({
  variant,
  onClose,
  onSave,
}: {
  variant: ProductVariant;
  onClose: () => void;
  onSave: (data: Partial<ProductVariant>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    size: variant.size,
    gender: variant.gender,
    color: variant.color ?? "",
    sku: variant.sku,
    price: variant.price,
    discount_price: variant.discount_price ?? "",
    cost_price: variant.cost_price ?? "",
    barcode: variant.barcode ?? "",
    is_active: variant.is_active,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        size: form.size,
        gender: form.gender,
        color: form.color || null,
        sku: form.sku,
        price: form.price,
        discount_price: form.discount_price || null,
        cost_price: form.cost_price || null,
        barcode: form.barcode || null,
        is_active: form.is_active,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.sku?.[0] ?? "Failed to save variant.");
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
        className="relative w-full max-w-lg mx-4 bg-slate-950 border border-slate-800 rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white">
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold text-white mb-1">Edit Variant</h2>
        <p className="text-slate-500 text-sm mb-6">SKU: {variant.sku}</p>
        {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-xl">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Size</label>
              <select
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value as Size })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">SKU *</label>
              <input
                required
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Color</label>
              <input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                placeholder="e.g. Red"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Price *</label>
              <input
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Discount Price</label>
              <input
                value={form.discount_price}
                onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Cost Price</label>
              <input
                value={form.cost_price}
                onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">Barcode</label>
            <input
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 font-mono text-sm"
              placeholder="Optional barcode"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="var_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 accent-indigo-500"
            />
            <label htmlFor="var_active" className="text-sm text-slate-300">Active</label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Variant"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function VariantsPage() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ProductVariant | null>(null);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const data = await getVariants();
      setVariants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch variants error:", err);
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVariants(); }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteVariant(id);
      setVariants((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Delete variant error:", err);
    }
  };

  const handleSave = async (data: Partial<ProductVariant>) => {
    if (!editing) return;
    await updateVariant(editing.id, data);
    await fetchVariants();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return variants.filter(
      (v) =>
        v.sku.toLowerCase().includes(q) ||
        (v.color ?? "").toLowerCase().includes(q) ||
        v.size.toLowerCase().includes(q) ||
        (v.barcode ?? "").toLowerCase().includes(q)
    );
  }, [variants, search]);

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Variants</h1>
          <p className="text-slate-400 text-sm mt-1">{variants.length} variants total</p>
        </div>
        <button onClick={fetchVariants} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl mb-6">
        <Search size={16} className="text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by SKU, size, color, barcode..."
          className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-slate-600"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading variants...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Boxes size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">{search ? "No matching variants." : "No variants found."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
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
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-sm text-indigo-300">{v.sku}</td>
                    <td className="p-4 text-sm">{v.size}</td>
                    <td className="p-4 text-sm text-slate-400">{v.gender}</td>
                    <td className="p-4 text-sm text-slate-400">{v.color || "—"}</td>
                    <td className="p-4 text-sm font-semibold">${v.price}</td>
                    <td className="p-4 text-sm text-slate-400">{v.discount_price ? `$${v.discount_price}` : "—"}</td>
                    <td className="p-4 font-mono text-xs text-slate-500">{v.barcode || "—"}</td>
                    <td className="p-4">
                      {v.is_active
                        ? <CheckCircle size={14} className="text-green-400" />
                        : <XCircle size={14} className="text-slate-600" />
                      }
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(v)} className="text-slate-400 hover:text-white p-1">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(v.id)} className="text-slate-400 hover:text-red-400 p-1">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <EditVariantModal
            variant={editing}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
