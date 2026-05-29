import API from "@/lib/api";

export const getVariantStockHistory = async (variantId: string | number) => {
  const res = await API.get(`/stock_history/variant/${variantId}/history/`);
  return res.data;
};
