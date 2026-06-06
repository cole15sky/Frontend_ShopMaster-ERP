"use client";

import Link from "next/link";
import { ShoppingCart, Minus, Plus, Trash2, RefreshCcw, ArrowRight } from "lucide-react";
import ShopGate from "@/components/customer/ShopGate";
import { useCart } from "@/features/shop/hooks";
import type { Customer } from "@/types/customer";

function CartView({ customer }: { customer: Customer }) {
  const { items, map, loading, subtotal, count, setQuantity, removeItem, clear, refresh } = useCart(
    customer.id
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="text-indigo-400" /> My Cart
          </h1>
          <p className="text-slate-400 text-sm mt-1">{count} item(s) in your cart</p>
        </div>
        <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">Your cart is empty.</p>
          <Link
            href="/dashboard/customer/products"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold"
          >
            Browse products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((it) => {
              const info = map[it.variant];
              const v = info?.variant;
              const unit = v ? Number(v.discount_price ?? v.price) : 0;
              return (
                <div
                  key={it.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {info?.product.name ?? `Variant #${it.variant}`}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {v ? `${v.sku} · ${v.size} · ${v.gender}${v.color ? ` · ${v.color}` : ""}` : "—"}
                    </p>
                    <p className="text-indigo-400 font-bold text-sm mt-1">${unit.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(it.id, it.quantity - 1)}
                      className="p-1.5 hover:bg-slate-700 rounded-lg"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{it.quantity}</span>
                    <button
                      onClick={() => setQuantity(it.id, it.quantity + 1)}
                      className="p-1.5 hover:bg-slate-700 rounded-lg"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right w-20 flex-shrink-0">
                    <p className="font-bold text-white text-sm">${(unit * it.quantity).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}

            <button onClick={clear} className="text-sm text-slate-500 hover:text-red-400 mt-2">
              Clear cart
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Subtotal ({count} items)</span>
              <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400 mb-4">
              <span>Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="border-t border-slate-800 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-indigo-400">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/dashboard/customer/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold transition"
            >
              Checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <ShopGate>{(customer) => <CartView customer={customer} />}</ShopGate>
    </div>
  );
}
