"use client";

import { useState, useEffect } from "react";
import { Save, Package, layers, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductForm({ product, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    description: "",
    status: "Active",
  });

  const [options, setOptions] = useState({ brands: [], categories: [] });

  // Fetch Lookups for Select Inputs
  useEffect(() => {
    const fetchLookups = async () => {
      const [bRes, cRes] = await Promise.all([
        fetch("http://localhost:8000/api/brands/"),
        fetch("http://localhost:8000/api/categories/")
      ]);
      setOptions({ brands: await bRes.json(), categories: await cRes.json() });
    };
    fetchLookups();

    if (product) {
      setFormData({
        name: product.name || "",
        brand_id: product.brand?.id || "",
        category_id: product.category?.id || "",
        description: product.description || "",
        status: product.status || "Active",
      });
    }
  }, [product]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-5">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Product Name</label>
        <input
          required
          className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Brand</label>
          <select 
            className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl text-white outline-none"
            value={formData.brand_id}
            onChange={(e) => setFormData({...formData, brand_id: e.target.value})}
          >
            <option value="">Select Brand</option>
            {options.brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Category</label>
          <select 
            className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl text-white outline-none"
            value={formData.category_id}
            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
          >
            <option value="">Select Category</option>
            {options.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Status</label>
        <select 
          className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl text-white outline-none"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold">Cancel</button>
        <button type="submit" className="flex-[2] px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
          <Save size={18} /> Save Product
        </button>
      </div>
    </form>
  );
}