"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, MapPin, CreditCard, ArrowRight, Loader2 } from "lucide-react";
import ShopGate from "@/components/customer/ShopGate";
import { useCart, useAddresses } from "@/features/shop/hooks";
import type { Customer } from "@/types/customer";

function CheckoutView({ customer }: { customer: Customer }) {
  const router = useRouter();
  const { items, map, subtotal, count, clear, loading: cartLoading } = useCart(customer.id);
  const { addresses, loading: addrLoading } = useAddresses(customer.id);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (addresses.length && addressId == null) {
      setAddressId((addresses.find((a) => a.is_default) ?? addresses[0]).id);
    }
  }, [addresses, addressId]);

  const placeOrder = async () => {
    setPlacing(true);
    try {
      // No order endpoint in this module yet — finalize by clearing the cart.
      await clear();
      setDone(true);
      setTimeout(() => router.push("/dashboard/customer"), 2500);
    } finally {
      setPlacing(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-24">
        <CheckCircle2 size={56} className="text-green-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Order placed!</h1>
        <p className="text-slate-400 mt-2">Thank you for your purchase. Redirecting…</p>
      </div>
    );
  }

  if (!cartLoading && items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Your cart is empty.</p>
        <Link
          href="/dashboard/customer/products"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold"
        >
          Browse products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* SHIPPING ADDRESS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-indigo-400" /> Shipping Address
            </h2>
            {addrLoading ? (
              <p className="text-slate-500 text-sm">Loading addresses…</p>
            ) : addresses.length === 0 ? (
              <div className="text-sm text-slate-400">
                No address on file.{" "}
                <Link href="/dashboard/customer/addresses" className="text-indigo-400 hover:underline">
                  Add one
                </Link>
                .
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      addressId === a.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={addressId === a.id}
                      onChange={() => setAddressId(a.id)}
                      className="mt-1 accent-indigo-500"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-white">
                        {a.full_name} · <span className="text-slate-400">{a.phone}</span>
                      </p>
                      <p className="text-slate-400">
                        {a.address_line}, {[a.city, a.district, a.province].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* ITEMS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold mb-4">Order Items ({count})</h2>
            <div className="space-y-3">
              {items.map((it) => {
                const info = map[it.variant];
                const v = info?.variant;
                const unit = v ? Number(v.discount_price ?? v.price) : 0;
                return (
                  <div key={it.id} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {info?.product.name ?? `Variant #${it.variant}`}{" "}
                      <span className="text-slate-500">× {it.quantity}</span>
                    </span>
                    <span className="text-white font-medium">${(unit * it.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-indigo-400" /> Payment Summary
          </h2>
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Subtotal</span>
            <span className="text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-400 mb-4">
            <span>Shipping</span>
            <span className="text-green-400">Free</span>
          </div>
          <div className="border-t border-slate-800 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-indigo-400">${subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing || items.length === 0 || (addresses.length > 0 && addressId == null)}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {placing ? <Loader2 className="animate-spin" size={18} /> : "Place Order"}
          </button>
          <p className="text-slate-600 text-xs text-center mt-3">
            Cash on delivery. Order API integration pending.
          </p>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <ShopGate>{(customer) => <CheckoutView customer={customer} />}</ShopGate>
    </div>
  );
}
