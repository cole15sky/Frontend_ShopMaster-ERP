"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Package, ImageIcon, Tag, Star, UploadCloud } from "lucide-react";
import { getBrands, getCategories } from "@/features/products/api";
import { createVariant } from "@/features/variants/api";

type VariantDraft = {
  size: string;
  color: string;
  sku: string;
  price: string;
  discount_price: string;
  cost_price: string;
  barcode: string;
  gender: string;
};

// Local UI tracking structure
type ImageDraft = {
  file: File;
  previewUrl: string;
  is_primary: boolean;
};

type Props = {
  product?: any | null;
  onSave: (data: any) => Promise<any>;
  onClose: () => void;
};

export default function ProductForm({ product, onSave, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Tracks both file references and primary flags
  const [images, setImages] = useState<ImageDraft[]>([]);

  const [form, setForm] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    gender: "Unisex",
    status: "Active",
    description: "",
  });

  const [variants, setVariants] = useState<VariantDraft[]>([
    { size: "", color: "", sku: "", price: "", discount_price: "", cost_price: "", barcode: "", gender: "Unisex" },
  ]);

  useEffect(() => {
    Promise.all([getBrands(), getCategories()]).then(([brands, categories]) => {
      setBrands(brands);
      setCategories(categories);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    const newImages: ImageDraft[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      is_primary: images.length === 0, // Automatically makes the first uploaded image primary
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const togglePrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        is_primary: idx === index, // Only one can be true
      }))
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      if (prev[index]?.is_primary && filtered.length > 0) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { size: "", color: "", sku: "", price: "", discount_price: "", cost_price: "", barcode: "", gender: "Unisex" }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantDraft, value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 1. Save Core Product
      const createdProduct = await onSave({
        name: form.name,
        brand_id: form.brand_id ? Number(form.brand_id) : null,
        category_id: form.category_id ? Number(form.category_id) : null,
        description: form.description,
        status: form.status,
      });

      if (createdProduct?.id) {
        // 2. Upload Images to the /product-images/ route sequentially using FormData
        await Promise.all(
          images.map(async (img) => {
            const formData = new FormData();
            formData.append("product", String(createdProduct.id));
            formData.append("image", img.file);
            formData.append("is_primary", String(img.is_primary));

            return fetch("http://127.0.0.1:8000/product-images/", {
              method: "POST",
              body: formData, // Fetch applies multi-part headers automatically
            });
          })
        );

        // 3. Save Product Variants
        await Promise.all(
          variants
            .filter((v) => v.size && v.price && v.sku)
            .map((v) =>
              createVariant({
                product: createdProduct.id,
                size: v.size,
                color: v.color,
                sku: v.sku,
                price: v.price,
                discount_price: v.discount_price || null,
                cost_price: v.cost_price || null,
                barcode: v.barcode || null,
                gender: v.gender,
                is_active: true,
              })
            )
        );
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-h-[85vh] overflow-y-auto pr-2">
      <div>
        <h2 className="text-3xl font-black text-white">Create Product</h2>
        <p className="text-slate-400 mt-1">Add products, variants, and select primary image display weights.</p>
      </div>

      {/* BASIC INFO */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Package size={18} /> Basic Information
        </div>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product Name" className={inputStyle} />
        
        <div className="grid md:grid-cols-2 gap-4">
          <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className={inputStyle}>
            <option value="">Select Brand</option>
            {brands.map((brand) => (<option key={brand.id} value={brand.id}>{brand.name}</option>))}
          </select>
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputStyle}>
            <option value="">Select Category</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>

        <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product Description" className={inputStyle} />
      </motion.div>

      {/* RE-ENGINEERED RESPONSIVE IMAGE UPLOAD */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-white font-semibold mb-4">
          <ImageIcon size={18} /> Product Images
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition bg-slate-900/40 group mb-4"
        >
          <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          <UploadCloud className="mx-auto text-slate-500 group-hover:text-indigo-400 mb-2 transition" size={28} />
          <p className="text-sm text-slate-300 font-medium">Click to upload product graphics</p>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square group rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <img src={img.previewUrl} alt="preview" className="h-full w-full object-cover" />
                
                {/* Hover UI overlay control action wrappers */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => togglePrimaryImage(i)}
                    className={`p-2 rounded-full ${img.is_primary ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-amber-400'}`}
                  >
                    <Star size={16} fill={img.is_primary ? "currentColor" : "none"} />
                  </button>
                  <button type="button" onClick={() => removeImage(i)} className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>

                {img.is_primary && (
                  <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    PRIMARY
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VARIANTS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2"><Tag size={18} /> Product Variants</h3>
          <button type="button" onClick={addVariant} className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-xl text-white">
            <Plus size={16} /> Add Variant
          </button>
        </div>

        {variants.map((variant, index) => (
          <motion.div key={index} layout className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
            <div className="flex justify-between mb-4">
              <h4 className="text-white font-semibold">Variant #{index + 1}</h4>
              {variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(index)} className="text-red-400"><Trash2 size={16} /></button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input placeholder="SKU" value={variant.sku} onChange={(e) => updateVariant(index, "sku", e.target.value)} className={inputStyle} />
              <input placeholder="Color" value={variant.color} onChange={(e) => updateVariant(index, "color", e.target.value)} className={inputStyle} />
              <input placeholder="Price" value={variant.price} onChange={(e) => updateVariant(index, "price", e.target.value)} className={inputStyle} />
              <input placeholder="Discount Price" value={variant.discount_price} onChange={(e) => updateVariant(index, "discount_price", e.target.value)} className={inputStyle} />
              <input placeholder="Cost Price" value={variant.cost_price} onChange={(e) => updateVariant(index, "cost_price", e.target.value)} className={inputStyle} />
              <input placeholder="Barcode" value={variant.barcode} onChange={(e) => updateVariant(index, "barcode", e.target.value)} className={inputStyle} />
            </div>
          </motion.div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center gap-2"
      >
        <Save size={18} />
        {loading ? "Saving Product..." : "Create Product"}
      </button>
    </form>
  );
}