import API from "@/lib/api";

// GET ALL VARIANTS
export const getVariants = async () => {
  const res = await API.get("/variants/");
  return res.data;
};

// GET SINGLE VARIANT
export const getVariant = async (id) => {
  const res = await API.get(`/variants/${id}/`);
  return res.data;
};

// CREATE VARIANT
export const createVariant = async (data) => {
  const res = await API.post("/variants/", data);
  return res.data;
};

// UPDATE VARIANT
export const updateVariant = async (id, data) => {
  const res = await API.put(`/variants/${id}/`, data);
  return res.data;
};

// DELETE VARIANT
export const deleteVariant = async (id) => {
  const res = await API.delete(`/variants/${id}/`);
  return res.data;
};