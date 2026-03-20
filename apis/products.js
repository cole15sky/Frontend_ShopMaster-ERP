import API from "./api";

export const getBrands = () => API.get("products/brands/");
export const getCategories = () => API.get("products/categories/");
export const getProducts = () => API.get("products/");
export const getVariants = () => API.get("products/variants/");

export const getProductVariants = (id) =>
  API.get(`products/${id}/variants/`);

export const getStockHistory = (variantId) =>
  API.get(`products/stock_history/variant/${variantId}/history/`);


export const createProduct = (data) =>
  API.post("products/", data);

export const createBrand = (data) =>
  API.post("products/brands/", data);

export const createCategory = (data) =>
  API.post("products/categories/", data);

export const createVariant = (data) =>
  API.post("products/variants/", data);