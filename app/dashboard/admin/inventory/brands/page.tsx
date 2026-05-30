"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RefreshCcw, Edit2, Trash2, X, Save, Tag, CheckCircle, XCircle } from "lucide-react";
import { useBrands } from "@/features/brands/hooks";
import type { Brand } from "@/types/product";

function BrandModal({
  item,
  onClose,
  onSave,
}: {
  item?: Brand | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    logo: item?.logo ?? "",
    is_active: item?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        name: form.name,
        logo: form.logo || null,
        is_active: form.is_active,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.name?.[0] ?? "Failed to save brand.");
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
        <h2 className="text-xl font-bold text-white mb-6">{item ? "Edit Brand" : "New Brand"}</h2>
        {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-xl">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
              placeholder="Brand name"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Logo URL</label>
            <input
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
              placeholder="https://..."
            />
            {form.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.logo} alt="preview" className="mt-2 w-16 h-16 object-contain rounded-lg border border-slate-700 bg-white/5 p-1" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="brand_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 accent-indigo-500"
            />
            <label htmlFor="brand_active" className="text-sm text-slate-300">Active</label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Brand"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function BrandsPage() {
  const { brands, loading, addBrand, editBrand, removeBrand, refresh } = useBrands();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Brand | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-slate-400 text-sm mt-1">{brands.length} brands total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => { setSelected(null); setOpen(true); }}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={18} /> Add Brand
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading brands...</div>
        ) : brands.length === 0 ? (
          <div className="p-10 text-center">
            <Tag size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No brands yet. Add your first brand.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-800">
                  <th className="p-4">Brand</th>
                  <th className="p-4">Logo</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="p-4 font-medium">{brand.name}</td>
                    <td className="p-4">
                      {brand.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain rounded-lg border border-slate-700 bg-white/5 p-1" />
                      ) : (
                        <span className="text-slate-600 text-sm">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {brand.is_active ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={13} /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500 text-xs"><XCircle size={13} /> Inactive</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setSelected(brand); setOpen(true); }} className="text-slate-400 hover:text-white p-1">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => removeBrand(brand.id)} className="text-slate-400 hover:text-red-400 p-1">
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
        {open && (
          <BrandModal
            item={selected}
            onClose={() => setOpen(false)}
            onSave={selected ? (data) => editBrand(selected.id, data) : addBrand}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
