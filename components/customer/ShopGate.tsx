"use client";

import { Loader2, UserX } from "lucide-react";
import { useActiveCustomer } from "@/features/shop/useActiveCustomer";
import type { Customer } from "@/types/customer";

/**
 * Resolves the active eCommerce customer and renders children with it.
 * Shows a loading / no-profile state otherwise. A selector is exposed while the
 * auth<->customer link is a backend "future enhancement".
 */
export default function ShopGate({
  children,
}: {
  children: (customer: Customer) => React.ReactNode;
}) {
  const { customer, customers, loading, setCustomerId } = useActiveCustomer();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
        <Loader2 className="animate-spin" size={20} /> Loading your account…
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <UserX size={48} className="text-slate-700 mx-auto mb-4" />
        <p className="text-slate-300 font-medium">No customer profile found.</p>
        <p className="text-slate-500 text-sm mt-1">
          Your account isn’t linked to a shop profile yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {customers.length > 1 && (
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <span>Acting as:</span>
          <select
            value={customer.id}
            onChange={(e) => setCustomerId(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-300"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name} ({c.email})
              </option>
            ))}
          </select>
        </div>
      )}
      {children(customer)}
    </>
  );
}
