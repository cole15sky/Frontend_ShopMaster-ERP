import API from "@/lib/api";
import type {
  Customer,
  CustomerAddress,
  CustomerAddressPayload,
  Cart,
  CartItem,
  CartItemPayload,
  Review,
  ReviewPayload,
  Wishlist,
  WishlistPayload,
} from "@/types/customer";

// DRF ModelViewSets may return bare arrays or {results:[...]}/{data:[...]} wrappers.
const list = <T,>(data: unknown): T[] => {
  const v = (data as any)?.results ?? (data as any)?.data ?? data ?? [];
  return Array.isArray(v) ? v : [];
};

/* ===================== Customers (eCommerce profile) ===================== */

export const getCustomers = async (params?: { search?: string; ordering?: string }): Promise<Customer[]> => {
  const res = await API.get("customers/customers/", { params });
  return list<Customer>(res.data);
};

export const getCustomer = async (id: number): Promise<Customer> => {
  const res = await API.get(`customers/customers/${id}/`);
  return (res.data as any)?.data ?? res.data;
};

export const createCustomer = async (data: Partial<Customer>): Promise<Customer> => {
  const res = await API.post("customers/customers/", data);
  return (res.data as any)?.data ?? res.data;
};

export const updateCustomer = async (id: number, data: Partial<Customer>): Promise<Customer> => {
  const res = await API.patch(`customers/customers/${id}/`, data);
  return (res.data as any)?.data ?? res.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await API.delete(`customers/customers/${id}/`);
};

/* ===================== Addresses ===================== */

export const getAddresses = async (): Promise<CustomerAddress[]> => {
  const res = await API.get("customers/customer-addresses/");
  return list<CustomerAddress>(res.data);
};

export const createAddress = async (data: CustomerAddressPayload): Promise<CustomerAddress> => {
  const res = await API.post("customers/customer-addresses/", data);
  return (res.data as any)?.data ?? res.data;
};

export const updateAddress = async (
  id: number,
  data: Partial<CustomerAddressPayload>
): Promise<CustomerAddress> => {
  const res = await API.patch(`customers/customer-addresses/${id}/`, data);
  return (res.data as any)?.data ?? res.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await API.delete(`customers/customer-addresses/${id}/`);
};

/* ===================== Carts ===================== */

export const getCarts = async (): Promise<Cart[]> => {
  const res = await API.get("customers/carts/");
  return list<Cart>(res.data);
};

export const createCart = async (customer: number): Promise<Cart> => {
  const res = await API.post("customers/carts/", { customer });
  return (res.data as any)?.data ?? res.data;
};

/* ===================== Cart Items ===================== */

export const getCartItems = async (): Promise<CartItem[]> => {
  const res = await API.get("customers/cart-items/");
  return list<CartItem>(res.data);
};

export const createCartItem = async (data: CartItemPayload): Promise<CartItem> => {
  const res = await API.post("customers/cart-items/", data);
  return (res.data as any)?.data ?? res.data;
};

export const updateCartItem = async (
  id: number,
  data: Partial<CartItemPayload>
): Promise<CartItem> => {
  const res = await API.patch(`customers/cart-items/${id}/`, data);
  return (res.data as any)?.data ?? res.data;
};

export const deleteCartItem = async (id: number): Promise<void> => {
  await API.delete(`customers/cart-items/${id}/`);
};

/* ===================== Reviews ===================== */

export const getReviews = async (): Promise<Review[]> => {
  const res = await API.get("customers/reviews/");
  return list<Review>(res.data);
};

export const createReview = async (data: ReviewPayload): Promise<Review> => {
  const res = await API.post("customers/reviews/", data);
  return (res.data as any)?.data ?? res.data;
};

export const updateReview = async (id: number, data: Partial<ReviewPayload>): Promise<Review> => {
  const res = await API.patch(`customers/reviews/${id}/`, data);
  return (res.data as any)?.data ?? res.data;
};

export const deleteReview = async (id: number): Promise<void> => {
  await API.delete(`customers/reviews/${id}/`);
};

/* ===================== Wishlists ===================== */

export const getWishlists = async (): Promise<Wishlist[]> => {
  const res = await API.get("customers/wishlists/");
  return list<Wishlist>(res.data);
};

export const createWishlist = async (data: WishlistPayload): Promise<Wishlist> => {
  const res = await API.post("customers/wishlists/", data);
  return (res.data as any)?.data ?? res.data;
};

export const deleteWishlist = async (id: number): Promise<void> => {
  await API.delete(`customers/wishlists/${id}/`);
};
