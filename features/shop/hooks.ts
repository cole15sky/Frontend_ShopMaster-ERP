"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts } from "@/features/products/api";
import type { Product, ProductVariant } from "@/types/product";
import {
  getCarts,
  createCart,
  getCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getWishlists,
  createWishlist,
  deleteWishlist,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getReviews,
  createReview,
  deleteReview,
} from "./api";
import type {
  CartItem,
  Wishlist,
  CustomerAddress,
  CustomerAddressPayload,
  Review,
  ReviewPayload,
} from "@/types/customer";

export type VariantInfo = { variant: ProductVariant; product: Product };

/** Loads products once, builds a variant-id -> {variant, product} map for display. */
export function useVariantMap() {
  const [map, setMap] = useState<Record<number, VariantInfo>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getProducts();
        const normalized = (data as any)?.results ?? data ?? [];
        const prods: Product[] = Array.isArray(normalized) ? normalized : [];
        if (!active) return;
        const m: Record<number, VariantInfo> = {};
        for (const p of prods) {
          for (const v of p.variants ?? []) m[v.id] = { variant: v, product: p };
        }
        setProducts(prods);
        setMap(m);
      } catch (err) {
        console.error("Variant map error:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { map, products, loading };
}

const price = (v?: ProductVariant) =>
  v ? Number(v.discount_price ?? v.price) : 0;

/** Cart for a given customer: resolves/creates the cart, manages its items. */
export function useCart(customerId?: number) {
  const [cartId, setCartId] = useState<number | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { map, loading: mapLoading } = useVariantMap();

  const resolveCart = useCallback(async (): Promise<number | null> => {
    if (!customerId) return null;
    const carts = await getCarts();
    const existing = carts.find((c) => c.customer === customerId);
    if (existing) return existing.id;
    const created = await createCart(customerId);
    return created.id;
  }, [customerId]);

  const fetchCart = useCallback(async () => {
    if (!customerId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const id = await resolveCart();
      setCartId(id);
      if (id == null) {
        setItems([]);
        return;
      }
      const allItems = await getCartItems();
      setItems(allItems.filter((it) => it.cart === id));
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  }, [customerId, resolveCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (variant: number, quantity = 1) => {
      let id = cartId ?? (await resolveCart());
      if (id == null) return;
      setCartId(id);
      const existing = items.find((it) => it.variant === variant);
      if (existing) {
        await updateCartItem(existing.id, { quantity: existing.quantity + quantity });
      } else {
        await createCartItem({ cart: id, variant, quantity });
      }
      await fetchCart();
    },
    [cartId, items, resolveCart, fetchCart]
  );

  const setQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      if (quantity <= 0) {
        await deleteCartItem(itemId);
      } else {
        await updateCartItem(itemId, { quantity });
      }
      await fetchCart();
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      await deleteCartItem(itemId);
      await fetchCart();
    },
    [fetchCart]
  );

  const clear = useCallback(async () => {
    await Promise.all(items.map((it) => deleteCartItem(it.id)));
    await fetchCart();
  }, [items, fetchCart]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + price(map[it.variant]?.variant) * it.quantity, 0),
    [items, map]
  );

  const count = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);

  return {
    cartId,
    items,
    map,
    loading: loading || mapLoading,
    subtotal,
    count,
    addItem,
    setQuantity,
    removeItem,
    clear,
    refresh: fetchCart,
  };
}

/** Wishlist for a given customer. */
export function useWishlist(customerId?: number) {
  const [items, setItems] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { map, loading: mapLoading } = useVariantMap();

  const fetchWishlist = useCallback(async () => {
    if (!customerId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const all = await getWishlists();
      setItems(all.filter((w) => w.customer === customerId));
    } catch (err) {
      console.error("Fetch wishlist error:", err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const has = useCallback((variant: number) => items.some((w) => w.variant === variant), [items]);

  const add = useCallback(
    async (variant: number) => {
      if (!customerId || has(variant)) return;
      await createWishlist({ customer: customerId, variant });
      await fetchWishlist();
    },
    [customerId, has, fetchWishlist]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteWishlist(id);
      await fetchWishlist();
    },
    [fetchWishlist]
  );

  const toggle = useCallback(
    async (variant: number) => {
      const existing = items.find((w) => w.variant === variant);
      if (existing) await remove(existing.id);
      else await add(variant);
    },
    [items, add, remove]
  );

  return { items, map, loading: loading || mapLoading, has, add, remove, toggle, refresh: fetchWishlist };
}

/** Addresses for a given customer. */
export function useAddresses(customerId?: number) {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    if (!customerId) {
      setAddresses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const all = await getAddresses();
      setAddresses(all.filter((a) => a.customer === customerId));
    } catch (err) {
      console.error("Fetch addresses error:", err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const add = useCallback(
    async (data: CustomerAddressPayload) => {
      await createAddress(data);
      await fetchAddresses();
    },
    [fetchAddresses]
  );

  const edit = useCallback(
    async (id: number, data: Partial<CustomerAddressPayload>) => {
      await updateAddress(id, data);
      await fetchAddresses();
    },
    [fetchAddresses]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteAddress(id);
      await fetchAddresses();
    },
    [fetchAddresses]
  );

  return { addresses, loading, add, edit, remove, refresh: fetchAddresses };
}

/** Reviews — all, plus filtered by product/customer helpers. */
export function useReviews(customerId?: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      setReviews(await getReviews());
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const mine = useMemo(
    () => (customerId ? reviews.filter((r) => r.customer === customerId) : []),
    [reviews, customerId]
  );

  const forProduct = useCallback(
    (productId: number) => reviews.filter((r) => r.product === productId),
    [reviews]
  );

  const add = useCallback(
    async (data: ReviewPayload) => {
      await createReview(data);
      await fetchReviews();
    },
    [fetchReviews]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteReview(id);
      await fetchReviews();
    },
    [fetchReviews]
  );

  return { reviews, mine, forProduct, loading, add, remove, refresh: fetchReviews };
}
