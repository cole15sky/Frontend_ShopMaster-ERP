type ProductFormData = {
  name: string;
  description?: string;
  status?: string;
  brand?: { id: string | number } | null;
  brand_id?: string | number | null;
  category?: { id: string | number } | null;
  category_id?: string | number | null;
};

export function mapProductPayload(formData: ProductFormData) {
  return {
    name: formData.name,
    description: formData.description,
    status: formData.status || "Active",
    brand_id: formData.brand?.id ?? formData.brand_id ?? null,
    category_id: formData.category?.id ?? formData.category_id ?? null,
  };
}
