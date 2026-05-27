import API from "@/lib/api";

// GET STOCK HISTORY OF VARIANT
export const getVariantStockHistory = async (variantId) => {
  const res = await API.get(
    `/stock_history/variant/${variantId}/history/`
  );

  return res.data;
};