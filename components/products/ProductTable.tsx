"use client";

import { Edit2, Trash2, Package } from "lucide-react";

export default function ProductTable({ products, loading, onEdit, onDelete }) {
  if (loading) return <div className="p-10 text-center text-slate-500">Loading Inventory...</div>;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/40">
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Product</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Brand</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {products.map((p) => (
            <tr key={p.id} className="group hover:bg-slate-800/20 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-indigo-400"><Package size={14}/></div>
                  <span className="font-medium text-slate-200">{p.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-400 text-sm">{p.brand?.name || "—"}</td>
              <td className="px-6 py-4 text-slate-400 text-sm">{p.category?.name || "—"}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(p)} className="p-2 text-slate-500 hover:text-white"><Edit2 size={16} /></button>
                  <button onClick={() => onDelete(p.id)} className="p-2 text-slate-500 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}