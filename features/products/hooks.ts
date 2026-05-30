"use client";

import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "./api";
import { mapProductPayload } from "./mapper";
import type { Product } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const normalized = (data as any)?.results ?? data ?? [];
      setProducts(Array.isArray(normalized) ? normalized : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (formData: any): Promise<Product> => {
    const payload = mapProductPayload(formData);
    const created = await createProduct(payload);
    await fetchProducts();
    return created;
  };

  const editProduct = async (id: number, formData: any): Promise<void> => {
    const payload = mapProductPayload(formData);
    await updateProduct(id, payload);
    await fetchProducts();
  };

  const removeProduct = async (id: number): Promise<void> => {
    await deleteProduct(id);
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, addProduct, editProduct, removeProduct, refresh: fetchProducts };
}
