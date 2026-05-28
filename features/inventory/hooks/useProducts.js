import { useEffect, useState } from "react";
import { getProducts } from "../api";

type Product = any;

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // CRUD placeholders (safe for now)
  const addProduct = async (formData: any) => {
    console.log("Add product:", formData);
  };

  const editProduct = async (id: any, formData: any) => {
    console.log("Edit product:", id, formData);
  };

  const removeProduct = async (id: any) => {
    console.log("Remove product:", id);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    editProduct,
    removeProduct,
    refresh: fetchProducts,
  };
};