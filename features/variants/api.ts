import API from "@/lib/api";
import type { ProductVariant } from "@/types/product";

export const getVariants = async (): Promise<ProductVariant[]> => {
  const res = await API.get("products/variants/");
  return res.data;
};

export const getVariant = async (id: number): Promise<ProductVariant> => {
  const res = await API.get(`products/variants/${id}/`);
  return res.data;
};

export const createVariant = async (data: Omit<ProductVariant, "id">): Promise<ProductVariant> => {
  const res = await API.post("products/variants/", data);
  return res.data;
};

export const updateVariant = async (id: number, data: Partial<Omit<ProductVariant, "id">>): Promise<ProductVariant> => {
  const res = await API.patch(`products/variants/${id}/`, data);
  return res.data;
};

export const deleteVariant = async (id: number): Promise<void> => {
  await API.delete(`products/variants/${id}/`);
};
