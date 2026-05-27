import API from "@/lib/api";

// GET ALL PRODUCTS
export const getProducts = async () => {
  const res = await API.get("products/");
  return res.data;
};

// GET SINGLE PRODUCT
export const getProduct = async (id) => {
  const res = await API.get(`products/${id}/`);
  return res.data;
};

// CREATE PRODUCT
export const createProduct = async (data) => {
  const res = await API.post("products/", data);
  return res.data;
};

// UPDATE PRODUCT
export const updateProduct = async (id, data) => {
  const res = await API.put(`products/${id}/`, data);
  return res.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const res = await API.delete(`products/${id}/`);
  return res.data;
};

// VARIANTS
export const getProductVariants = async (id) => {
  const res = await API.get(`products/${id}/variants/`);
  return res.data;
};

// LOOKUPS
export const getBrands = async () => {
  const res = await API.get("products/brands/");
  return res.data;
};

export const getCategories = async () => {
  const res = await API.get("products/categories/");
  return res.data;
};