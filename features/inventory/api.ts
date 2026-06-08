import API from "@/lib/api";
import type {
  Inventory,
  LowStockItem,
  StockInPayload,
  StockOutPayload,
  StockAdjustPayload,
} from "@/types/inventory";

export const getInventory = async (): Promise<Inventory[]> => {
  const res = await API.get("inventory/");
  return res.data;
};

export const getInventoryItem = async (id: number): Promise<Inventory> => {
  const res = await API.get(`inventory/${id}/`);
  return res.data;
};

export const createInventory = async (data: {
  variant: number;
  quantity: number;
  low_stock_alert?: number;
}): Promise<Inventory> => {
  const res = await API.post("inventory/", data);
  return res.data;
};

export const updateInventory = async (
  id: number,
  data: Partial<{ variant: number; quantity: number; low_stock_alert: number }>
): Promise<Inventory> => {
  const res = await API.patch(`inventory/${id}/`, data);
  return res.data;
};

export const deleteInventory = async (id: number): Promise<void> => {
  await API.delete(`inventory/${id}/`);
};

/* ===================== Stock operations ===================== */

// Increase stock for a variant
export const stockIn = async (data: StockInPayload): Promise<Record<string, unknown>> => {
  const res = await API.post("inventory/stock-in/", data);
  return res.data;
};

// Decrease stock for a variant (backend enforces stock >= 0)
export const stockOut = async (data: StockOutPayload): Promise<Record<string, unknown>> => {
  const res = await API.post("inventory/stock-out/", data);
  return res.data;
};

// Manually set/correct stock quantity (audit)
export const stockAdjust = async (data: StockAdjustPayload): Promise<Record<string, unknown>> => {
  const res = await API.post("inventory/adjust/", data);
  return res.data;
};

// Items where stock <= low_stock_alert
export const getLowStock = async (): Promise<LowStockItem[]> => {
  const res = await API.get("inventory/low-stock/");
  const data = (res.data as any)?.results ?? (res.data as any)?.data ?? res.data ?? [];
  return Array.isArray(data) ? data : [];
};
