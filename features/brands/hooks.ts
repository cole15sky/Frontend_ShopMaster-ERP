"use client";

import { useEffect, useState } from "react";
import { getBrands, createBrand, updateBrand, deleteBrand } from "./api";
import type { Brand } from "@/types/product";

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch brands error:", err);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const addBrand = async (data: Omit<Brand, "id">) => {
    await createBrand(data);
    await fetchBrands();
  };

  const editBrand = async (id: number, data: Partial<Omit<Brand, "id">>) => {
    await updateBrand(id, data);
    await fetchBrands();
  };

  const removeBrand = async (id: number) => {
    await deleteBrand(id);
    await fetchBrands();
  };

  useEffect(() => { fetchBrands(); }, []);

  return { brands, loading, addBrand, editBrand, removeBrand, refresh: fetchBrands };
}
