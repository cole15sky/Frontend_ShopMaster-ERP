import API from "@/lib/api";

export async function getProducts() {
  try {
    const res = await API.get("products/");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

export async function getProductsBySlug(slug, token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await API.get(`products/${slug}/`, { headers });
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch product ${slug}:`, err);
    throw err;
  }
}

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
export const getProducts = () => API.get("products/");
export const createProduct = (data) => API.post("products/", data);
export const updateProduct = (id, data) => API.put(`products/${id}/`, data);
export const deleteProduct = (id) => API.delete(`products/${id}/`);

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