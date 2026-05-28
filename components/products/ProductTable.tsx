"use client";

import { Edit2, Trash2, Package } from "lucide-react";

// =========================
// TYPES
// =========================
type Product = {
  id: number | string;
  name: string;
  status?: string;
  brand?: {
    name?: string;
  };
  category?: {
    name?: string;
  };
};

type Props = {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number | string) => void;
};

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400">
        Loading products...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">

        {/* HEADER */}
        <thead>
          <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-800">
            <th className="p-4">Product</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="border-b border-slate-800 hover:bg-slate-900/40"
            >
              <td className="p-4 flex items-center gap-3">
                <Package size={16} className="text-indigo-400" />
                {p.name}
              </td>

              <td className="text-slate-400">
                {p.brand?.name || "-"}
              </td>

              <td className="text-slate-400">
                {p.category?.name || "-"}
              </td>

              <td>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    p.status === "ACTIVE"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {p.status}
                </span>
              </td>

              <td className="text-right p-4 flex justify-end gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="text-slate-400 hover:text-white"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => onDelete(p.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}