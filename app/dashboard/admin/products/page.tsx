"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Package, BarChart3, AlertCircle, 
  Search, Filter, ArrowDownToLine, RefreshCcw 
} from "lucide-react";

import { useProducts } from "@/features/products/hooks";
import ProductTable from "@/components/products/ProductTable";
import ProductModal from "@/components/products/ProductModal";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ProductsPage() {
  const { 
    products, brands, categories, loading, 
    addProduct, editProduct, removeProduct, refreshData 
  } = useProducts();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic: Real-time filtering for responsiveness
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const stats = [
    { 
        label: "Total Items", 
        value: products?.length || 0, 
        icon: Package, 
        color: "text-indigo-400", 
        bg: "bg-indigo-500/10" 
    },
    { 
        label: "Active Stock", 
        value: products?.filter(p => p.status === 'Active').length || 0, 
        icon: BarChart3, 
        color: "text-emerald-400", 
        bg: "bg-emerald-500/10" 
    },
    { 
        label: "Low Stock", 
        value: products?.filter(p => p.stock < 10).length || 0, 
        icon: AlertCircle, 
        color: "text-rose-400", 
        bg: "bg-rose-500/10" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-slate-400 font-sans selection:bg-indigo-500/30">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1600px] mx-auto p-4 md:p-10 lg:p-14 space-y-10"
      >
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Live Inventory
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Products<span className="text-indigo-500">.</span>
            </h1>
            <p className="text-slate-500 max-w-md text-sm md:text-base">
              Manage your global catalog, track stock levels, and monitor performance in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => refreshData()}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all active:scale-95"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-semibold text-white transition-all">
              <ArrowDownToLine size={18} /> Export CSV
            </button>
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelected(null); setOpen(true); }}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all"
            >
              <Plus size={20} strokeWidth={3} /> 
              <span>Create Product</span>
            </motion.button>
          </div>
        </header>

        {/* METRICS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="relative overflow-hidden bg-[#121624] border border-white/[0.03] p-7 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-500"
            >
              <div className="relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-white leading-none tracking-tight">{stat.value}</p>
              </div>
              <div className={`relative z-10 p-5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={28} strokeWidth={2.5} />
              </div>
              {/* Subtle background glow */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity ${stat.bg}`} />
            </motion.div>
          ))}
        </section>

        {/* CONTROL BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl backdrop-blur-xl">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, Name, or Attribute..."
              className="w-full bg-slate-900/40 border border-white/[0.05] focus:border-indigo-500/50 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900/60 rounded-xl text-sm font-bold text-slate-300 border border-white/[0.05] hover:bg-slate-800 transition-all">
                <Filter size={18} /> 
                <span>Filters</span>
                <span className="ml-1 w-5 h-5 flex items-center justify-center bg-indigo-500 text-[10px] text-white rounded-full">2</span>
             </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#111625]/40 border border-white/[0.05] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm"
        >
          <div className="min-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
            <ProductTable
              products={filteredProducts}
              loading={loading}
              onEdit={(p) => { setSelected(p); setOpen(true); }}
              onDelete={removeProduct}
            />
          </div>
        </motion.div>
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