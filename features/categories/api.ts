import API from "@/lib/api";
import type { Category } from "@/types/product";

export const getCategories = async (): Promise<Category[]> => {
  const res = await API.get("products/categories/");
  return res.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const res = await API.get(`products/categories/${id}/`);
  return res.data;
};

export const createCategory = async (data: Omit<Category, "id">): Promise<Category> => {
  const res = await API.post("products/categories/", data);
  return res.data;
};

export const updateCategory = async (id: number, data: Partial<Omit<Category, "id">>): Promise<Category> => {
  const res = await API.patch(`products/categories/${id}/`, data);
  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await API.delete(`products/categories/${id}/`);
};
