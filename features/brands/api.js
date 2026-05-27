import API from "@/lib/api";

export const getBrands = async () => {
  const res = await API.get("/brands/");
  return res.data;
};

export const getBrand = async (id) => {
  const res = await API.get(`/brands/${id}/`);
  return res.data;
};

export const createBrand = async (data) => {
  const res = await API.post("/brands/", data);
  return res.data;
};

export const updateBrand = async (id, data) => {
  const res = await API.put(`/brands/${id}/`, data);
  return res.data;
};

export const deleteBrand = async (id) => {
  const res = await API.delete(`/brands/${id}/`);
  return res.data;
};