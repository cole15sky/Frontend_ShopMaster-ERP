"use client";

import { useProducts } from "@/features/products/hooks";
import ProductTable from "@/components/products/ProductTable";
import ProductModal from "@/components/products/ProductModal";
import { useState } from "react";
import { Plus, Package, BarChart3, AlertCircle, Search, Filter, ArrowDownToLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  const { products, brands, categories, loading, addProduct, editProduct, removeProduct, refreshData } = useProducts();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Items", value: products?.length || 0, icon: Package, color: "text-indigo-400" },
    { label: "Active Status", value: products?.filter(p => p.status === 'Active').length || 0, icon: BarChart3, color: "text-emerald-400" },
    { label: "Stock Alerts", value: "3", icon: AlertCircle, color: "text-rose-400" },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-300 font-sans selection:bg-indigo-500/30">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 space-y-8"
      >
        {/* TOP HEADER: ERP STYLE */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.2em]">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Inventory System
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Products Catalog<span className="text-indigo-500">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold transition-all">
              <ArrowDownToLine size={16} /> Export
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelected(null); setOpen(true); }}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
            >
              <Plus size={20} strokeWidth={3} /> 
              <span>Add New Item</span>
            </motion.button>
          </div>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111625] border border-slate-800/50 p-6 rounded-[2rem] flex items-center justify-between group hover:border-slate-700 transition-colors"
            >
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl bg-slate-900 shadow-inner group-hover:scale-110 transition-transform`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CONTROL BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111625]/50 border border-slate-800/50 p-4 rounded-2xl backdrop-blur-md">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Filter by SKU, name, or brand..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 rounded-xl text-sm font-medium border border-slate-700 hover:border-indigo-500/50 transition-all">
                <Filter size={16} /> Filters
             </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#111625] border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl overflow-x-auto scrollbar-hide">
          <ProductTable
            products={products}
            loading={loading}
            onEdit={(p) => { setSelected(p); setOpen(true); }}
            onDelete={removeProduct}
          />
        </div>
      </motion.div>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {open && (
          <ProductModal
            product={selected}
            onClose={() => setOpen(false)}
            onSave={selected ? (data) => editProduct(selected.id, data) : addProduct}
            brands={brands}
            categories={categories}
            onRefresh={refreshData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}