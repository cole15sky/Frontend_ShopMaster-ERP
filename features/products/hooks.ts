"use client";

import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "./api";
import { mapProductPayload } from "./mapper";

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const normalized = data?.results ?? data ?? [];
      setProducts(Array.isArray(normalized) ? normalized : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (formData: any) => {
    try {
      const payload = mapProductPayload(formData);
      return await createProduct(payload);
    } catch (err: any) {
      console.error("Add product error:", err);
      alert(err?.detail || "Failed to create product");
    }
  };

  const editProduct = async (id: string | number, formData: any) => {
    try {
      const payload = mapProductPayload(formData);
      await updateProduct(id, payload);
      await fetchProducts();
    } catch (err) {
      console.error("Edit error:", err);
      alert("Update failed");
    }
  };

  const removeProduct = async (id: string | number) => {
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, addProduct, editProduct, removeProduct, refresh: fetchProducts };
}
