"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Search, Package, X, ChevronDown, ChevronUp, Tag, Boxes } from "lucide-react";
import { useProducts } from "@/features/products/hooks";
import type { Product, ProductVariant } from "@/types/product";

function VariantRow({ variant }: { variant: ProductVariant }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-slate-800/40 rounded-lg text-sm">
      <span className="font-mono text-indigo-300 text-xs w-28 truncate">{variant.sku}</span>
      <span className="text-slate-400 w-10">{variant.size}</span>
      <span className="text-slate-400 w-16">{variant.gender}</span>
      <span className="text-slate-400 flex-1">{variant.color || "—"}</span>
      <span className="font-semibold text-white">${variant.price}</span>
      {variant.discount_price && (
        <span className="text-green-400 text-xs">${variant.discount_price} sale</span>
      )}
      <span className={`px-2 py-0.5 text-xs rounded-full ${variant.is_active ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-500"}`}>
        {variant.is_active ? "Active" : "Off"}
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-indigo-400" />
          </div>
          <div>
            <p className="font-semibold text-white">{product.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {product.brand && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Tag size={10} /> {product.brand.name}
                </span>
              )}
              {product.category && (
                <span className="text-xs text-slate-500">· {product.category.name}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs rounded-lg ${product.status === "ACTIVE" ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"}`}>
            {product.status}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Boxes size={12} /> {product.variants?.length ?? 0}
          </span>
          {expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && product.variants?.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-800"
          >
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-4 px-4 py-1 text-xs uppercase text-slate-600">
                <span className="w-28">SKU</span>
                <span className="w-10">Size</span>
                <span className="w-16">Gender</span>
                <span className="flex-1">Color</span>
                <span>Price</span>
                <span className="w-20" />
              </div>
              {product.variants.map((v) => (
                <VariantRow key={v.id} variant={v} />
              ))}
            </div>
          </motion.div>
        )}
        {expanded && (!product.variants || product.variants.length === 0) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-800 p-4"
          >
            <p className="text-slate-500 text-sm text-center">No variants for this product.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StaffProductsPage() {
  const { products, loading, refresh } = useProducts();
  const [search, setSearch] = useState("");
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.category?.name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || p.status === (statusFilter === "ACTIVE" ? "ACTIVE" : "INACTIVE");
      return matchSearch && matchStatus;
    });
  }, [products, search, statusFilter]);

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-slate-400 text-sm mt-1">{products.length} products · {products.reduce((s, p) => s + (p.variants?.length ?? 0), 0)} variants</p>
        </div>
        <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
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
            placeholder="Search by name, brand, category..."
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-slate-600"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${statusFilter === s ? "bg-indigo-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT LIST */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">No products match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
