export function mapProductPayload(formData) {
  return {
    name: formData.name,
    description: formData.description,
    status: formData.status || "Active",

    brand_id: formData.brand?.id || formData.brand_id || null,
    category_id: formData.category?.id || formData.category_id || null,
  };
}