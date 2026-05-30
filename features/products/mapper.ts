import type { ProductStatus } from "@/types/product";

type ProductFormData = {
  name: string;
  description?: string | null;
  status?: string;
  brand?: { id: number } | null;
  brand_id?: number | null;
  category?: { id: number } | null;
  category_id?: number | null;
};

export function mapProductPayload(formData: ProductFormData) {
  return {
    name: formData.name,
    description: formData.description ?? null,
    status: (formData.status as ProductStatus) || "Active",
    brand_id: formData.brand?.id ?? formData.brand_id ?? null,
    category_id: formData.category?.id ?? formData.category_id ?? null,
  };
}
