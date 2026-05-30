export type Brand = {
  id: number;
  name: string;
  logo?: string | null;
  is_active: boolean;
};

export type Category = {
  id: number;
  name: string;
  parent?: number | null;
  is_active: boolean;
};

export type ProductStatus = "Active" | "Inactive";
export type Gender = "Male" | "Female" | "Unisex";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type ProductVariant = {
  id: number;
  product: number;
  size: Size;
  gender: Gender;
  color?: string | null;
  sku: string;
  price: string;
  discount_price?: string | null;
  cost_price?: string | null;
  barcode?: string | null;
  qr_code?: string | null;
  is_active: boolean;
};

export type Product = {
  id: number;
  name: string;
  brand: Brand;
  brand_id?: number | null;
  category: Category;
  category_id?: number | null;
  description?: string | null;
  status: ProductStatus;
  slug: string;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
};
