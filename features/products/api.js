import API from "@/lib/api";

// --- Products ---
export const getProducts = async () => {
  try {
    const res = await API.get("products/");
    return res.data;
  } catch (err) {
    console.error("Get products failed:", err);
    throw err;
  }
};

export const createProduct = async (data) => {
  try {
    const res = await API.post("products/", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const res = await API.put(`products/${id}/`, data);
    return res.data;
  } catch (err) {
    console.error("Update failed:", err.response?.data || err);
    throw err.response?.data || err;
  }
};

export const deleteProduct = async (id) => {
  try {
    await API.delete(`products/${id}/`);
  } catch (err) {
    console.error("Delete failed:", err);
    throw err;
  }
};

// --- Brands ---
export const getBrands = () => API.get("products/brands/");
export const createBrand = (data) => API.post("products/brands/", data);
export const updateBrand = (id, data) => API.put(`products/brands/${id}/`, data);
export const deleteBrand = (id) => API.delete(`products/brands/${id}/`);

// --- Categories ---
export const getCategories = () => API.get("products/categories/");
export const createCategory = (data) => API.post("products/categories/", data);
export const updateCategory = (id, data) => API.put(`products/categories/${id}/`, data);
export const deleteCategory = (id) => API.delete(`products/categories/${id}/`);

// --- Products ---
// export const getProducts = () => API.get("products/");
// export const createProduct = (data) => API.post("products/", data);
// export const updateProduct = (id, data) => API.put(`products/${id}/`, data);
// export const deleteProduct = (id) => API.delete(`products/${id}/`);

// --- Variants ---
export const getVariants = () => API.get("products/variants/");
export const getProductVariants = (productId) =>
  API.get(`products/${productId}/variants/`);
export const createVariant = (data) => API.post("products/variants/", data);
export const updateVariant = (id, data) => API.put(`products/variants/${id}/`, data);
export const deleteVariant = (id) => API.delete(`products/variants/${id}/`);

// --- Stock / Inventory ---
export const getStockHistory = (variantId) =>
  API.get(`products/stock_history/variant/${variantId}/history/`);