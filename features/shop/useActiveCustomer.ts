"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context";
import { getCustomers } from "./api";
import type { Customer } from "@/types/customer";

const OVERRIDE_KEY = "shop_customer_id";

/**
 * Resolves the eCommerce Customer profile for the logged-in user.
 *
 * Auth user (users/) and eCommerce customer (customers/customers/) are separate
 * models; linking them is a backend "future enhancement". Stopgap: match by email,
 * with a manual localStorage override (setCustomerId) as fallback.
 */
export function useActiveCustomer() {
  const { user, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    let active = true;

    (async () => {
      setLoading(true);
      try {
        const all = await getCustomers();
        if (!active) return;
        setCustomers(all);

        const overrideId = Number(localStorage.getItem(OVERRIDE_KEY)) || null;
        const byOverride = overrideId ? all.find((c) => c.id === overrideId) : null;
        const byEmail = user?.email ? all.find((c) => c.email === user.email) : null;
        setCustomer(byOverride ?? byEmail ?? all[0] ?? null);
      } catch (err) {
        console.error("Resolve customer error:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [authLoading, user?.email]);

  const setCustomerId = (id: number) => {
    localStorage.setItem(OVERRIDE_KEY, String(id));
    setCustomer(customers.find((c) => c.id === id) ?? null);
  };

  return { customer, customers, loading, setCustomerId };
}
