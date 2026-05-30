"use client";

import { useEffect, useState } from "react";
import { getBrands, getCategories } from "@/features/products/api";
import { createVariant } from "@/features/variants/api";
import { Save, Plus, Trash2 } from "lucide-react";
import type { Product, Brand, Category, Gender, Size, ProductStatus } from "@/types/product";

type VariantDraft = {
  size: Size | "";
  color: string;
  sku: string;
  price: string;
  discount_price: string;
  cost_price: string;
  barcode: string;
  gender: Gender;
};

type Props = {
  product?: Product | null;
  onSave: (data: any) => Promise<any>;
  onClose: () => void;
};

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDERS: Gender[] = ["Male", "Female", "Unisex"];
const STATUSES: ProductStatus[] = ["Active", "Inactive"];

export default function ProductForm({ product, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    gender: "Unisex" as Gender,
    status: "Active" as ProductStatus,
    description: "",
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [variants, setVariants] = useState<VariantDraft[]>([
    { size: "", color: "", sku: "", price: "", discount_price: "", cost_price: "", barcode: "", gender: "Unisex" },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getBrands(), getCategories()])
      .then(([b, c]) => {
        setBrands(b);
        setCategories(c);
      })
      .catch((err) => console.error("Lookup error:", err));
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        brand_id: String(product.brand?.id ?? ""),
        category_id: String(product.category?.id ?? ""),
        gender: "Unisex",
        status: product.status,
        description: product.description ?? "",
      });
    }
  }, [product]);

  const addVariant = () => {
    setVariants([
      ...variants,
      { size: "", color: "", sku: "", price: "", discount_price: "", cost_price: "", barcode: "", gender: form.gender },
    ]);
  };

  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));

  const updateVariant = (i: number, field: keyof VariantDraft, value: string) => {
    const updated = [...variants];
    updated[i] = { ...updated[i], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createdProduct = await onSave({
        name: form.name,
        brand_id: form.brand_id ? Number(form.brand_id) : null,
        category_id: form.category_id ? Number(form.category_id) : null,
        status: form.status,
        description: form.description || null,
      });

      if (createdProduct?.id) {
        const validVariants = variants.filter((v) => v.sku && v.price && v.size);
        await Promise.all(
          validVariants.map((v) =>
            createVariant({
              product: createdProduct.id,
              size: v.size as Size,
              color: v.color || null,
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
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto pr-1">
      <div>
        <h2 className="text-2xl font-black text-white">
          {product ? "Edit Product" : "Create Product"}
        </h2>
        <p className="text-slate-500 text-sm mt-1">Manage products and variants.</p>
      </div>

      {/* PRODUCT FIELDS */}
      <div className="space-y-4">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product Name"
          className="w-full bg-slate-900 px-4 py-3 rounded-xl text-white border border-slate-700 focus:border-indigo-500 outline-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.brand_id}
            onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
            className="bg-slate-900 p-3 rounded-xl text-white border border-slate-700"
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="bg-slate-900 p-3 rounded-xl text-white border border-slate-700"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
            className="bg-slate-900 p-3 rounded-xl text-white border border-slate-700"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
            className="bg-slate-900 p-3 rounded-xl text-white border border-slate-700"
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description (optional)"
          rows={3}
          className="w-full bg-slate-900 p-3 rounded-xl text-white border border-slate-700 focus:border-indigo-500 outline-none resize-none"
        />
      </div>

      {/* VARIANTS */}
      {!product && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Variants</h3>

          {variants.map((v, i) => (
            <div key={i} className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={v.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                  className="bg-slate-800 p-2 rounded-lg text-white border border-slate-600 text-sm"
                >
                  <option value="">Size</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={v.gender}
                  onChange={(e) => updateVariant(i, "gender", e.target.value)}
                  className="bg-slate-800 p-2 rounded-lg text-white border border-slate-600 text-sm"
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                <input
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => updateVariant(i, "color", e.target.value)}
                  className="bg-slate-800 p-2 rounded-lg text-white border border-slate-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="SKU *"
                  value={v.sku}
                  onChange={(e) => updateVariant(i, "sku", e.target.value)}
                  className="bg-slate-800 p-2 rounded-lg text-white border border-slate-600 text-sm"
                />
                <input
                  placeholder="Price *"
                  value={v.price}
                  onChange={(e) => updateVariant(i, "price", e.target.value)}
                  className="bg-slate-800 p-2 rounded-lg text-white border border-slate-600 text-sm"
                />
                <input
                  placeholder="Discount Price"
                  value={v.discount_price}
                  onChange={(e) => updateVariant(i, "discount_price", e.target.value)}
                  className="bg-slate-800 p-2 rounded-lg text-white border border-slate-600 text-sm"
                />
                <input
                  placeholder="Cost Price"
                  value={v.cost_price}
                  onChange={(e) => updateVariant(i, "cost_price", e.target.value)}
                  className="bg-slate-800 p-2 rounded-lg text-white border border-slate-600 text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <input
                  placeholder="Barcode"
                  value={v.barcode}
                  onChange={(e) => updateVariant(i, "barcode", e.target.value)}
                  className="bg-slate-800 p-2 rounded-lg text-white border border-slate-600 text-sm flex-1 mr-3"
                />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm"
          >
            <Plus size={16} /> Add Variant
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Save size={16} />
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
