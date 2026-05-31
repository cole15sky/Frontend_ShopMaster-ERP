import API from "@/lib/api";

export const uploadProductImage = async (data: FormData) => {
  const res = await API.post("/product-images/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProductImage = async (id: string | number) => {
  const res = await API.delete(`/product-images/${id}/`);
  return res.data;
};
