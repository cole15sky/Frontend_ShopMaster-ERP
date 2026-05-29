import API from "@/lib/api";

export const getVariants = async () => {
  const res = await API.get("/variants/");
  return res.data;
};

export const getVariant = async (id: string | number) => {
  const res = await API.get(`/variants/${id}/`);
  return res.data;
};

export const createVariant = async (data: Record<string, unknown>) => {
  const res = await API.post("/variants/", data);
  return res.data;
};

export const updateVariant = async (id: string | number, data: Record<string, unknown>) => {
  const res = await API.put(`/variants/${id}/`, data);
  return res.data;
};

export const deleteVariant = async (id: string | number) => {
  const res = await API.delete(`/variants/${id}/`);
  return res.data;
};
