"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Package,
  BarChart3,
  AlertCircle,
  Search,
  RefreshCcw,
} from "lucide-react";

import { useProducts } from "@/features/products/hooks";
import ProductTable from "@/components/products/ProductTable";
import ProductModal from "@/components/products/ProductModal";

export default function ProductsPage() {
  const {
    products,
    loading,
    addProduct,
    editProduct,
    removeProduct,
    refresh,
  } = useProducts();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p: any) =>
      p?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p?.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
    },
    {
      label: "Active Stock",
      value: products.filter((p: any) => p.status === "ACTIVE").length,
      icon: BarChart3,
    },
    {
      label: "Low Stock",
      value: products.filter((p: any) => (p.stock || 0) < 10).length,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <div className="flex gap-3">

          <button
            onClick={refresh}
            className="p-2 bg-gray-800 rounded"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="bg-indigo-600 px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </button>

        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <div className="flex items-center gap-2 bg-gray-900 p-2 rounded">
          <Search size={18} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded">
            <div className="text-sm text-gray-400">{s.label}</div>
            <div className="text-xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <ProductTable
        products={filteredProducts}
        loading={loading}
        onEdit={(p: any) => {
          setSelected(p);
          setOpen(true);
        }}
        onDelete={removeProduct}
      />

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <ProductModal
  product={selected}
  onClose={() => setOpen(false)}
  onSave={
    selected
      ? (data: any) => editProduct(selected.id, data)
      : addProduct
  }
/>
        )}
      </AnimatePresence>

    </div>
  );
}