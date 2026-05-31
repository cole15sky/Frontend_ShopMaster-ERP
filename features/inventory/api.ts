import API from "@/lib/api";
import type { Inventory } from "@/types/inventory";

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
