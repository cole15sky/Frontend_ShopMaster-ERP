import API from "@/lib/api";

/* =========================
   PRODUCTS
========================= */

export const getProducts = () =>
  API.get("/").then((res) => res.data);

export const createProduct = (data) =>
  API.post("/", data).then((res) => res.data);

export const updateProduct = (id, data) =>
  API.patch(`/${id}/`, data).then((res) => res.data);

export const deleteProduct = (id) =>
  API.delete(`/${id}/`).then((res) => res.data);

/* =========================
   LOOKUPS
========================= */

export const getBrands = () =>
  API.get("/brands/").then((res) => res.data);

export const getCategories = () =>
  API.get("/categories/").then((res) => res.data);

/* =========================
   VARIANTS
========================= */

export const createVariant = (data) =>
  API.post("/variants/", data).then((res) => res.data);