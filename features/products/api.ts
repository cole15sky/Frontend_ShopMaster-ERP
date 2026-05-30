import API from "@/lib/api";
import type { Product, ProductVariant, Brand, Category } from "@/types/product";

export const getProducts = async (): Promise<Product[]> => {
  const res = await API.get("products/");
  return res.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const res = await API.get(`products/${id}/`);
  return res.data;
};

export const createProduct = async (data: {
  name: string;
  brand_id?: number | null;
  category_id?: number | null;
  description?: string | null;
  status?: "Active" | "Inactive";
}): Promise<Product> => {
  const res = await API.post("products/", data);
  return res.data;
};

export const updateProduct = async (
  id: number,
  data: Partial<{
    name: string;
    brand_id: number | null;
    category_id: number | null;
    description: string | null;
    status: "Active" | "Inactive";
  }>
): Promise<Product> => {
  const res = await API.patch(`products/${id}/`, data);
  return res.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await API.delete(`products/${id}/`);
};

export const getProductVariants = async (id: number): Promise<ProductVariant[]> => {
  const res = await API.get(`products/${id}/variants/`);
  return res.data;
};

export const getBrands = async (): Promise<Brand[]> => {
  const res = await API.get("products/brands/");
  return res.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await API.get("products/categories/");
  return res.data;
};
