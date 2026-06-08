"use client";

import Link from "next/link";
import { Heart, Trash2, RefreshCcw, ShoppingCart, ArrowRight } from "lucide-react";
import ShopGate from "@/components/customer/ShopGate";
import { useWishlist, useCart } from "@/features/shop/hooks";
import type { Customer } from "@/types/customer";

function WishlistView({ customer }: { customer: Customer }) {
  const { items, map, loading, remove, refresh } = useWishlist(customer.id);
  const { addItem } = useCart(customer.id);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="text-pink-400" /> Wishlist
          </h1>
          <p className="text-slate-400 text-sm mt-1">{items.length} saved item(s)</p>
        </div>
        <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">No saved items yet.</p>
          <Link
            href="/dashboard/customer/products"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold"
          >
            Browse products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((w) => {
            const info = map[w.variant];
            const v = info?.variant;
            const unit = v ? Number(v.discount_price ?? v.price) : 0;
            return (
              <div key={w.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-white truncate pr-2">
                    {info?.product.name ?? `Variant #${w.variant}`}
                  </p>
                  <button
                    onClick={() => remove(w.id)}
                    className="text-slate-500 hover:text-red-400 flex-shrink-0"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  {v ? `${v.sku} · ${v.size} · ${v.gender}${v.color ? ` · ${v.color}` : ""}` : "—"}
                </p>
                <p className="text-indigo-400 font-bold mt-2">${unit.toFixed(2)}</p>
                <button
                  onClick={() => addItem(w.variant)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-xl text-sm font-semibold transition"
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <ShopGate>{(customer) => <WishlistView customer={customer} />}</ShopGate>
    </div>
  );
}
