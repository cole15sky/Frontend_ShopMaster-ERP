import API from "@/lib/api";

export const getCategories = async () => {
  const res = await API.get("/categories/");
  return res.data;
};

export const getCategory = async (id: string | number) => {
  const res = await API.get(`/categories/${id}/`);
  return res.data;
};

export const createCategory = async (data: Record<string, unknown>) => {
  const res = await API.post("/categories/", data);
  return res.data;
};

export const updateCategory = async (id: string | number, data: Record<string, unknown>) => {
  const res = await API.put(`/categories/${id}/`, data);
  return res.data;
};

export const deleteCategory = async (id: string | number) => {
  const res = await API.delete(`/categories/${id}/`);
  return res.data;
};
