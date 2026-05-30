import API from "@/lib/api";
import type { Brand } from "@/types/product";

export const getBrands = async (): Promise<Brand[]> => {
  const res = await API.get("products/brands/");
  return res.data;
};

export const getBrand = async (id: number): Promise<Brand> => {
  const res = await API.get(`products/brands/${id}/`);
  return res.data;
};

export const createBrand = async (data: Omit<Brand, "id">): Promise<Brand> => {
  const res = await API.post("products/brands/", data);
  return res.data;
};

export const updateBrand = async (id: number, data: Partial<Omit<Brand, "id">>): Promise<Brand> => {
  const res = await API.patch(`products/brands/${id}/`, data);
  return res.data;
};

export const deleteBrand = async (id: number): Promise<void> => {
  await API.delete(`products/brands/${id}/`);
};
