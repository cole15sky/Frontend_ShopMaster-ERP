"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getStaff,
  getSoftDeletedStaff,
  registerStaff,
  softDeleteStaff,
  recoverStaff,
  getCustomers,
  getSoftDeletedCustomers,
  registerCustomer,
  updateCustomer,
  softDeleteCustomer,
  recoverCustomer,
} from "./api";
import type {
  Staff,
  Customer,
  StaffRegisterPayload,
  CustomerRegisterPayload,
  CustomerUpdatePayload,
} from "@/types/user";

const toArray = <T,>(data: unknown): T[] => {
  const normalized = (data as any)?.results ?? data ?? [];
  return Array.isArray(normalized) ? normalized : [];
};

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [deletedStaff, setDeletedStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const [active, deleted] = await Promise.all([getStaff(), getSoftDeletedStaff()]);
      setStaff(toArray<Staff>(active));
      setDeletedStaff(toArray<Staff>(deleted));
    } catch (err) {
      console.error("Fetch staff error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addStaff = useCallback(
    async (data: StaffRegisterPayload) => {
      const created = await registerStaff(data);
      await fetchStaff();
      return created;
    },
    [fetchStaff]
  );

  const removeStaff = useCallback(
    async (id: number) => {
      await softDeleteStaff(id);
      await fetchStaff();
    },
    [fetchStaff]
  );

  const restoreStaff = useCallback(
    async (id: number) => {
      await recoverStaff(id);
      await fetchStaff();
    },
    [fetchStaff]
  );

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return { staff, deletedStaff, loading, addStaff, removeStaff, restoreStaff, refresh: fetchStaff };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deletedCustomers, setDeletedCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const [active, deleted] = await Promise.all([getCustomers(), getSoftDeletedCustomers()]);
      setCustomers(toArray<Customer>(active));
      setDeletedCustomers(toArray<Customer>(deleted));
    } catch (err) {
      console.error("Fetch customers error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCustomer = useCallback(
    async (data: CustomerRegisterPayload) => {
      const created = await registerCustomer(data);
      await fetchCustomers();
      return created;
    },
    [fetchCustomers]
  );

  const editCustomer = useCallback(
    async (id: number, data: CustomerUpdatePayload) => {
      const updated = await updateCustomer(id, data);
      await fetchCustomers();
      return updated;
    },
    [fetchCustomers]
  );

  const removeCustomer = useCallback(
    async (id: number) => {
      await softDeleteCustomer(id);
      await fetchCustomers();
    },
    [fetchCustomers]
  );

  const restoreCustomer = useCallback(
    async (id: number) => {
      await recoverCustomer(id);
      await fetchCustomers();
    },
    [fetchCustomers]
  );

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    deletedCustomers,
    loading,
    addCustomer,
    editCustomer,
    removeCustomer,
    restoreCustomer,
    refresh: fetchCustomers,
  };
}
