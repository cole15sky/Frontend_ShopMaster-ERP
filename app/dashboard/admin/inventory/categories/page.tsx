"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RefreshCcw, Edit2, Trash2, X, Save, Tag, CheckCircle, XCircle } from "lucide-react";
import { useCategories } from "@/features/categories/hooks";
import type { Category } from "@/types/product";

function CategoryModal({
  item,
  categories,
  onClose,
  onSave,
}: {
  item?: Category | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    parent: item?.parent ?? null as number | null,
    is_active: item?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.name?.[0] ?? "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const parents = categories.filter((c) => c.id !== item?.id);

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
          {item ? "Edit Category" : "New Category"}
        </h2>
        {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-xl">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Parent Category</label>
            <select
              value={form.parent ?? ""}
              onChange={(e) => setForm({ ...form, parent: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
            >
              <option value="">None (top-level)</option>
              {parents.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 accent-indigo-500"
            />
            <label htmlFor="is_active" className="text-sm text-slate-300">Active</label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Category"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, loading, addCategory, editCategory, removeCategory, refresh } = useCategories();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  const getParentName = (parentId: number | null | undefined) => {
    if (!parentId) return "—";
    return categories.find((c) => c.id === parentId)?.name ?? String(parentId);
  };

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-slate-400 text-sm mt-1">{categories.length} categories total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => { setSelected(null); setOpen(true); }}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center">
            <Tag size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No categories yet. Create your first one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-800">
                  <th className="p-4">Name</th>
                  <th className="p-4">Parent</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Tag size={14} className="text-indigo-400" />
                      {cat.name}
                    </td>
                    <td className="p-4 text-slate-400 text-sm">{getParentName(cat.parent)}</td>
                    <td className="p-4">
                      {cat.is_active ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs">
                          <CheckCircle size={13} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <XCircle size={13} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setSelected(cat); setOpen(true); }}
                          className="text-slate-400 hover:text-white p-1"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => removeCategory(cat.id)}
                          className="text-slate-400 hover:text-red-400 p-1"
                        >
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
          <CategoryModal
            item={selected}
            categories={categories}
            onClose={() => setOpen(false)}
            onSave={selected ? (data) => editCategory(selected.id, data) : addCategory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
