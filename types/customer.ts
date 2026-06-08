export type AddressType = "HOME" | "OFFICE" | "OTHER";

// eCommerce Customer profile (customers/customers/) — distinct from the auth User
export type Customer = {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  profile_picture?: string | null;
  date_of_birth?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CustomerAddress = {
  id: number;
  customer: number;
  address_type: AddressType;
  full_name: string;
  phone: string;
  province: string;
  district: string;
  city: string;
  ward?: string | null;
  address_line: string;
  landmark?: string | null;
  is_default?: boolean;
  created_at?: string;
};

export type Cart = {
  id: number;
  customer: number;
  created_at?: string;
  updated_at?: string;
};

export type CartItem = {
  id: number;
  cart: number;
  variant: number;
  quantity: number;
  created_at?: string;
};

export type Review = {
  id: number;
  customer: number;
  product: number;
  rating: number;
  comment?: string | null;
  created_at?: string;
};

export type Wishlist = {
  id: number;
  customer: number;
  variant: number;
  created_at?: string;
};

// Write payloads (omit read-only fields)
export type CustomerAddressPayload = Omit<CustomerAddress, "id" | "created_at">;
export type CartItemPayload = { cart: number; variant: number; quantity: number };
export type ReviewPayload = { customer: number; product: number; rating: number; comment?: string | null };
export type WishlistPayload = { customer: number; variant: number };
