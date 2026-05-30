"use client";

import { useEffect, useState } from "react";
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "./api";
import type { Inventory } from "@/types/inventory";

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getInventory();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch inventory error:", err);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const addInventory = async (data: { variant: number; quantity: number; low_stock_alert?: number }) => {
    try {
      await createInventory(data);
      await fetchInventory();
    } catch (err) {
      console.error("Create inventory error:", err);
      throw err;
    }
  };

  const editInventory = async (
    id: number,
    data: Partial<{ variant: number; quantity: number; low_stock_alert: number }>
  ) => {
    try {
      await updateInventory(id, data);
      await fetchInventory();
    } catch (err) {
      console.error("Update inventory error:", err);
      throw err;
    }
  };

  const removeInventory = async (id: number) => {
    try {
      await deleteInventory(id);
      await fetchInventory();
    } catch (err) {
      console.error("Delete inventory error:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return { inventory, loading, addInventory, editInventory, removeInventory, refresh: fetchInventory };
}
