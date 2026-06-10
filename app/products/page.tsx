"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/features/products/api";
import type { Product } from "@/types/product";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        console.log("PRODUCTS:", data);
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPrice = (product: Product) => {
    if (!product.variants?.length) return 0;

    const v = product.variants[0];
    return v.final_price || v.price;
  };

  // ✅ FIXED IMAGE LOGIC (ProductImage relation)
  const getImageUrl = (product: Product) => {
    const primary = product.images?.find((img: any) => img.is_primary);
    const first = product.images?.[0];

    const img = primary || first;

    if (!img?.image) return null;

    if (img.image.startsWith("http")) return img.image;

    return `${BASE_URL}${img.image}`;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 p-10">
        <Loader2 className="animate-spin" />
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 bg-red-500/10 p-3 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      <h1 className="text-3xl font-bold">Products</h1>
      <p className="text-slate-400 mb-8">
        All products added by admin
      </p>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <p className="text-slate-400">No products available.</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/products/${product.id}`)}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/40 hover:scale-[1.02] transition cursor-pointer"
          >
            {/* IMAGE */}
            <div className="h-40 bg-slate-900 flex items-center justify-center overflow-hidden">
              {getImageUrl(product) ? (
                <img
                  src={getImageUrl(product)!}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-500 text-xs">
                  No Image Available
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4">
              {/* BRAND */}
              {product.brand && (
                <p className="text-xs text-slate-400 mb-1">
                  {product.brand.name}
                </p>
              )}

              {/* NAME */}
              <h2 className="text-lg font-semibold">
                {product.name}
              </h2>

              {/* CATEGORY */}
              {product.category && (
                <p className="text-xs text-slate-500">
                  {product.category.name}
                </p>
              )}

              {/* DESCRIPTION */}
              <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                {product.description || "No description available"}
              </p>

              {/* PRICE */}
              <p className="text-green-400 font-bold mt-3">
                Rs. {getPrice(product)}
              </p>

              {/* VARIANTS */}
              {product.variants?.length > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  {product.variants.length} variants available
                </p>
              )}

              {/* BUTTON */}
              <button className="mt-4 w-full bg-green-600 hover:bg-green-500 py-2 rounded-xl flex items-center justify-center gap-2">
                <ShoppingCart size={16} />
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}