import API from "@/lib/api";
import type { StockHistory } from "@/types/inventory";

export const getVariantStockHistory = async (variantId: number): Promise<StockHistory> => {
  const res = await API.get(`products/stock-history/variant/${variantId}/history/`);
  return res.data;
};
