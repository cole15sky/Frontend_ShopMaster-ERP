import API from "@/lib/api";

export const getProducts = async () => {
  const res = await API.get("products/");
  return res.data;
};

export const getProduct = async (id: string | number) => {
  const res = await API.get(`products/${id}/`);
  return res.data;
};

export const createProduct = async (data: Record<string, unknown>) => {
  const res = await API.post("products/", data);
  return res.data;
};

export const updateProduct = async (id: string | number, data: Record<string, unknown>) => {
  const res = await API.put(`products/${id}/`, data);
  return res.data;
};

export const deleteProduct = async (id: string | number) => {
  const res = await API.delete(`products/${id}/`);
  return res.data;
};

export const getProductVariants = async (id: string | number) => {
  const res = await API.get(`products/${id}/variants/`);
  return res.data;
};

export const getBrands = async () => {
  const res = await API.get("products/brands/");
  return res.data;
};

export const getCategories = async () => {
  const res = await API.get("products/categories/");
  return res.data;
};
