"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

import {
  Save,
  Plus,
  Trash2,
  Package2,
} from "lucide-react";

import { createVariant } from "@/features/variants/api";

export default function ProductForm({
  product,
  onSave,
  onClose,
}) {

  // =========================================
  // MAIN PRODUCT FORM
  // =========================================
  const [form, setForm] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    gender: "UNISEX",
    status: "ACTIVE",
    description: "",
  });

  // =========================================
  // LOOKUPS
  // =========================================
  const [options, setOptions] = useState({
    brands: [],
    categories: [],
  });

  // =========================================
  // VARIANTS
  // =========================================
  const [variants, setVariants] = useState([
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

  // =========================================
  // LOAD BRANDS + CATEGORIES
  // =========================================
  useEffect(() => {

    const load = async () => {

      try {

        const [brandsRes, categoriesRes] =
          await Promise.all([
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

  // =========================================
  // EDIT MODE
  // =========================================
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

  // =========================================
  // ADD VARIANT
  // =========================================
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

  // =========================================
  // REMOVE VARIANT
  // =========================================
  const removeVariant = (index) => {

    setVariants(
      variants.filter((_, i) => i !== index)
    );

  };

  // =========================================
  // HANDLE VARIANT CHANGE
  // =========================================
  const updateVariant = (index, field, value) => {

    const updated = [...variants];

    updated[index][field] = value;

    setVariants(updated);

  };

  // =========================================
  // SUBMIT
  // =========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      // =========================
      // CREATE PRODUCT
      // =========================
      const createdProduct = await onSave({
        name: form.name,
        brand_id: form.brand_id || null,
        category_id: form.category_id || null,
        gender: form.gender,
        status: form.status,
        description: form.description,
      });

      // =========================
      // CREATE VARIANTS
      // =========================
      const validVariants =
        variants.filter(
          (v) =>
            v.sku &&
            v.price
        );

      await Promise.all(

        validVariants.map((variant) =>

          createVariant({
            product: createdProduct.id,
            size: variant.size || null,
            color: variant.color || null,
            sku: variant.sku,
            price: variant.price,
            discount_price:
              variant.discount_price || null,
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

    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}
      <div>

        <h2 className="text-2xl font-black text-white">
          {product
            ? "Edit Product"
            : "Create Product"}
        </h2>

        <p className="text-slate-500 text-sm mt-1">
          Manage products and variants
          inside one workflow.
        </p>

      </div>

      {/* ===================================== */}
      {/* PRODUCT SECTION */}
      {/* ===================================== */}
      <div className="space-y-5">

        <div>

          <label className="block text-sm mb-2 text-slate-400">
            Product Name
          </label>

          <input
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Nike Air Max"
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

        </div>

        {/* BRAND + CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm mb-2 text-slate-400">
              Brand
            </label>

            <select
              value={form.brand_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  brand_id: e.target.value,
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white"
            >

              <option value="">
                Select Brand
              </option>

              {options.brands.map((brand) => (

                <option
                  key={brand.id}
                  value={brand.id}
                >
                  {brand.name}
                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block text-sm mb-2 text-slate-400">
              Category
            </label>

            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  category_id: e.target.value,
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white"
            >

              <option value="">
                Select Category
              </option>

              {options.categories.map((category) => (

                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>

              ))}

            </select>

          </div>

        </div>

        {/* GENDER + STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm mb-2 text-slate-400">
              Gender
            </label>

            <select
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value,
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white"
            >

              <option value="UNISEX">
                Unisex
              </option>

              <option value="MEN">
                Men
              </option>

              <option value="WOMEN">
                Women
              </option>

            </select>

          </div>

          <div>

            <label className="block text-sm mb-2 text-slate-400">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white"
            >

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

              <option value="DRAFT">
                Draft
              </option>

            </select>

          </div>

        </div>

        {/* DESCRIPTION */}
        <div>

          <label className="block text-sm mb-2 text-slate-400">
            Description
          </label>

          <textarea
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Premium running shoe..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white resize-none"
          />

        </div>

      </div>

      {/* ===================================== */}
      {/* VARIANT SECTION */}
      {/* ===================================== */}
      <div className="space-y-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Package2 size={18} />
            </div>

            <div>

              <h3 className="text-lg font-bold text-white">
                Product Variants
              </h3>

              <p className="text-slate-500 text-sm">
                Add sizes, prices, and SKU
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold"
          >
            <Plus size={16} />
          </button>

        </div>

        {/* VARIANT LIST */}
        <div className="space-y-4">

          {variants.map((variant, index) => (

            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-900/50 border border-slate-800 rounded-2xl p-4"
            >

              {/* SIZE */}
              <select
                value={variant.size}
                onChange={(e) =>
                  updateVariant(
                    index,
                    "size",
                    e.target.value
                  )
                }
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white"
              >

                <option value="">
                  Size
                </option>

                <option value="X">
                  X
                </option>

                <option value="XL">
                  XL
                </option>

                <option value="XXL">
                  XXL
                </option>

              </select>

              {/* COLOR */}
              <input
                placeholder="Color"
                value={variant.color}
                onChange={(e) =>
                  updateVariant(
                    index,
                    "color",
                    e.target.value
                  )
                }
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white"
              />

              {/* SKU */}
              <input
                required
                placeholder="SKU"
                value={variant.sku}
                onChange={(e) =>
                  updateVariant(
                    index,
                    "sku",
                    e.target.value
                  )
                }
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white"
              />

              {/* PRICE */}
              <input
                required
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) =>
                  updateVariant(
                    index,
                    "price",
                    e.target.value
                  )
                }
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white"
              />

              {/* REMOVE */}
              <button
                type="button"
                onClick={() =>
                  removeVariant(index)
                }
                className="rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center"
              >
                <Trash2 size={18} />
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* ===================================== */}
      {/* ACTIONS */}
      {/* ===================================== */}
      <div className="flex gap-3 pt-2">

        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl py-4 font-semibold"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2"
        >

          <Save size={18} />

          {loading
            ? "Creating..."
            : "Create Product"}

        </button>

      </div>

    </form>
  );
}