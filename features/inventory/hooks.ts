"use client";

import { useEffect, useState } from "react";
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  stockIn,
  stockOut,
  stockAdjust,
  getLowStock,
} from "./api";
import type {
  Inventory,
  LowStockItem,
  StockInPayload,
  StockOutPayload,
  StockAdjustPayload,
} from "@/types/inventory";

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [data, low] = await Promise.all([getInventory(), getLowStock().catch(() => [])]);
      setInventory(Array.isArray(data) ? data : []);
      setLowStock(low);
    } catch (err) {
      console.error("Fetch inventory error:", err);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const doStockIn = async (data: StockInPayload) => {
    await stockIn(data);
    await fetchInventory();
  };

  const doStockOut = async (data: StockOutPayload) => {
    await stockOut(data);
    await fetchInventory();
  };

  const doStockAdjust = async (data: StockAdjustPayload) => {
    await stockAdjust(data);
    await fetchInventory();
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

  return {
    inventory,
    lowStock,
    loading,
    addInventory,
    editInventory,
    removeInventory,
    doStockIn,
    doStockOut,
    doStockAdjust,
    refresh: fetchInventory,
  };
}
