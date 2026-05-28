"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Save, Plus, Trash2, Package2 } from "lucide-react";
import { createVariant } from "@/features/variants/api";

// =============================
// TYPES
// =============================
type Product = {
  id?: number | string;
  name?: string;
  brand?: { id: string };
  category?: { id: string };
  gender?: string;
  status?: string;
  description?: string;
};

type Variant = {
  size: string;
  color: string;
  sku: string;
  price: string;
  discount_price?: string;
  gender: string;
};

type Props = {
  product?: Product | null;
  onSave: (data: any) => Promise<any>;
  onClose: () => void;
};

export default function ProductForm({
  product,
  onSave,
  onClose,
}: Props) {
  // =========================
  // MAIN PRODUCT FORM
  // =========================
  const [form, setForm] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    gender: "UNISEX",
    status: "ACTIVE",
    description: "",
  });

  // =========================
  // LOOKUPS
  // =========================
  const [options, setOptions] = useState<{
    brands: any[];
    categories: any[];
  }>({
    brands: [],
    categories: [],
  });

  // =========================
  // VARIANTS
  // =========================
  const [variants, setVariants] = useState<Variant[]>([
    {
      size: "",
      color: "",
      sku: "",
      price: "",
      discount_price: "",
      gender: "UNISEX",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD BRANDS + CATEGORIES
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          API.get("/products/brands/"),
          API.get("/products/categories/"),
        ]);

        setOptions({
          brands: brandsRes.data,
          categories: categoriesRes.data,
        });
      } catch (err) {
        console.error("Lookup Error:", err);
      }
    };

    load();
  }, []);

  // =========================
  // EDIT MODE
  // =========================
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        brand_id: product.brand?.id || "",
        category_id: product.category?.id || "",
        gender: product.gender || "UNISEX",
        status: product.status || "ACTIVE",
        description: product.description || "",
      });
    }
  }, [product]);

  // =========================
  // ADD VARIANT
  // =========================
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: "",
        color: "",
        sku: "",
        price: "",
        discount_price: "",
        gender: form.gender,
      },
    ]);
  };

  // =========================
  // REMOVE VARIANT
  // =========================
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // =========================
  // UPDATE VARIANT
  // =========================
  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string
  ) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const createdProduct = await onSave({
        name: form.name,
        brand_id: form.brand_id || null,
        category_id: form.category_id || null,
        gender: form.gender,
        status: form.status,
        description: form.description,
      });

      const validVariants = variants.filter((v) => v.sku && v.price);

      await Promise.all(
        validVariants.map((variant) =>
          createVariant({
            product: createdProduct.id,
            size: variant.size || null,
            color: variant.color || null,
            sku: variant.sku,
            price: variant.price,
            discount_price: variant.discount_price || null,
            gender: form.gender,
            is_active: true,
          })
        )
      );

      onClose();
    } catch (err) {
      console.error("Save Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">
          {product ? "Edit Product" : "Create Product"}
        </h2>

        <p className="text-slate-500 text-sm mt-1">
          Manage products and variants inside one workflow.
        </p>
      </div>

      {/* PRODUCT FORM */}
      <div className="space-y-5">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product Name"
          className="w-full bg-slate-900 px-4 py-3 rounded-xl text-white"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.brand_id}
            onChange={(e) =>
              setForm({ ...form, brand_id: e.target.value })
            }
            className="bg-slate-900 p-3 rounded-xl text-white"
          >
            <option value="">Select Brand</option>
            {options.brands.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={form.category_id}
            onChange={(e) =>
              setForm({ ...form, category_id: e.target.value })
            }
            className="bg-slate-900 p-3 rounded-xl text-white"
          >
            <option value="">Select Category</option>
            {options.categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full bg-slate-900 p-3 rounded-xl text-white"
        />
      </div>

      {/* VARIANTS */}
      <div className="space-y-4">
        {variants.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="SKU"
              value={v.sku}
              onChange={(e) =>
                updateVariant(i, "sku", e.target.value)
              }
              className="bg-slate-900 p-2 rounded"
            />

            <input
              placeholder="Price"
              value={v.price}
              onChange={(e) =>
                updateVariant(i, "price", e.target.value)
              }
              className="bg-slate-900 p-2 rounded"
            />

            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="text-red-400"
            >
              <Trash2 />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="text-indigo-400"
        >
          <Plus /> Add Variant
        </button>
      </div>

      {/* ACTIONS */}
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
      >
        <Save /> {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}