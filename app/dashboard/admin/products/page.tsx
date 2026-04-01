"use client";

import { useProducts } from "@/features/products/hooks";
import ProductTable from "@/components/products/ProductTable";
import ProductModal from "@/components/products/ProductModal";
import { useState } from "react";
import { Plus, Package, BarChart3, AlertCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  const { products, loading, addProduct, editProduct, removeProduct } = useProducts();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1400px] mx-auto space-y-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Inventory</h1>
            <p className="text-slate-400 mt-2 font-medium">Manage your product catalog.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelected(null); setOpen(true); }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-500/20 transition-all"
            >
              <Plus size={20} /> Add Product
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#111625] border border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl">
          <ProductTable
            products={products}
            loading={loading}
            onEdit={(p) => { setSelected(p); setOpen(true); }}
            onDelete={removeProduct}
          />
        </div>
      </motion.div>

      {/* Modal with AnimatePresence Fix */}
      <AnimatePresence>
        {open && (
          <ProductModal
            product={selected}
            onClose={() => setOpen(false)}
            onSave={(data) => {
              if (selected) {
                editProduct(selected.id, data);
              } else {
                addProduct(data);
              }
              setOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}