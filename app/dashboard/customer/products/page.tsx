"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, RefreshCcw, Package, X, ChevronDown,
  ChevronUp, Tag, Boxes, QrCode, ShoppingCart, Heart,
} from "lucide-react";
import { getProducts } from "@/features/products/api";
import { useActiveCustomer } from "@/features/shop/useActiveCustomer";
import { useCart, useWishlist } from "@/features/shop/hooks";
import type { Product, ProductVariant } from "@/types/product";

type VariantActions = {
  onAddToCart?: (variant: number) => void;
  onToggleWishlist?: (variant: number) => void;
  inWishlist?: (variant: number) => boolean;
  enabled?: boolean;
};

function VariantCard({ variant, actions }: { variant: ProductVariant; actions?: VariantActions }) {
  const saved = actions?.inWishlist?.(variant.id) ?? false;
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-mono text-indigo-300 text-xs truncate">{variant.sku}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {variant.size} · {variant.gender}
          {variant.color ? ` · ${variant.color}` : ""}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-white text-sm">${variant.price}</p>
        {variant.discount_price && (
          <p className="text-green-400 text-xs">${variant.discount_price} sale</p>
        )}
      </div>
      {variant.qr_code && (
        <a
          href={variant.qr_code}
          target="_blank"
          rel="noreferrer"
          download={`qr-${variant.sku}.png`}
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 text-slate-500 hover:text-indigo-400 transition"
          title="Download QR"
        >
          <QrCode size={14} />
        </a>
      )}
      {actions?.enabled && variant.is_active && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); actions.onToggleWishlist?.(variant.id); }}
            className={`p-1.5 transition ${saved ? "text-pink-400" : "text-slate-500 hover:text-pink-400"}`}
            title={saved ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={15} className={saved ? "fill-pink-400" : ""} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); actions.onAddToCart?.(variant.id); }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold transition"
            title="Add to cart"
          >
            <ShoppingCart size={13} /> Add
          </button>
        </>
      )}
      <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${variant.is_active ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-500"}`}>
        {variant.is_active ? "In Stock" : "Unavailable"}
      </span>
    </div>
  );
}

function ProductCard({ product, actions }: { product: Product; actions?: VariantActions }) {
  const [expanded, setExpanded] = useState(false);
  const activeVariants = product.variants?.filter((v) => v.is_active) ?? [];
  const minPrice = activeVariants.length
    ? Math.min(...activeVariants.map((v) => Number(v.price)))
    : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-800/30 transition text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Package size={20} className="text-indigo-400" />
          </div>
          <div>
            <p className="font-bold text-white">{product.name}</p>
            <div className="flex items-center gap-2 mt-1">
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
        <div className="flex items-center gap-3 flex-shrink-0">
          {minPrice !== null && (
            <span className="text-indigo-400 font-bold text-sm">from ${minPrice}</span>
          )}
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Boxes size={12} /> {product.variants?.length ?? 0}
          </span>
          {expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-800"
          >
            <div className="p-4 space-y-2">
              {product.description && (
                <p className="text-slate-400 text-sm mb-4 px-1">{product.description}</p>
              )}
              {product.variants?.length > 0 ? (
                product.variants.map((v) => <VariantCard key={v.id} variant={v} actions={actions} />)
              ) : (
                <p className="text-slate-500 text-sm text-center py-3">No variants available.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CustomerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const { customer } = useActiveCustomer();
  const { addItem } = useCart(customer?.id);
  const { has, toggle } = useWishlist(customer?.id);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const actions = {
    enabled: !!customer,
    onAddToCart: async (variant: number) => {
      try {
        await addItem(variant);
        flash("Added to cart");
      } catch {
        flash("Failed to add to cart");
      }
    },
    onToggleWishlist: async (variant: number) => {
      try {
        await toggle(variant);
        flash(has(variant) ? "Removed from wishlist" : "Added to wishlist");
      } catch {
        flash("Wishlist update failed");
      }
    },
    inWishlist: has,
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const normalized = (data as any)?.results ?? data ?? [];
      setProducts(Array.isArray(normalized) ? normalized : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand?.name ?? "").toLowerCase().includes(q) ||
        (p.category?.name ?? "").toLowerCase().includes(q)
    );
  }, [products, search]);

  const totalVariants = products.reduce((s, p) => s + (p.variants?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <p className="text-slate-400 text-sm mt-1">
            {products.length} products · {totalVariants} variants
          </p>
        </div>
        <button onClick={fetchProducts} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl mb-6">
        <Search size={16} className="text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products, brands, categories..."
          className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-slate-600"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white">
            <X size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">No products found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} actions={actions} />
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
