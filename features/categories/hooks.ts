"use client";

import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "./api";
import type { Category } from "@/types/product";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (data: Omit<Category, "id">) => {
    await createCategory(data);
    await fetchCategories();
  };

  const editCategory = async (id: number, data: Partial<Omit<Category, "id">>) => {
    await updateCategory(id, data);
    await fetchCategories();
  };

  const removeCategory = async (id: number) => {
    await deleteCategory(id);
    await fetchCategories();
  };

  useEffect(() => { fetchCategories(); }, []);

  return { categories, loading, addCategory, editCategory, removeCategory, refresh: fetchCategories };
}
