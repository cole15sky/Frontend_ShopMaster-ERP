export type Role = "ADMIN" | "STAFF" | "CUSTOMER";

export type User = {
  id: number;
  email: string;
  full_name?: string | null;
  role: Role;
  phone?: string | null;
  position?: string | null;
  profile_pic?: string | null;
  is_active: boolean;
  date_joined?: string;
};

export type Staff = User & { role: "STAFF" };
export type Customer = User & { role: "CUSTOMER" };

export type StaffRegisterPayload = {
  email: string;
  full_name: string;
  password: string;
  password2: string;
  phone?: string;
  position?: string;
};

export type CustomerRegisterPayload = {
  email: string;
  full_name: string;
  password: string;
  phone?: string;
  password2: string;
};

// Customer profile update — backend CustomerUpdate serializer (email is read-only)
export type CustomerUpdatePayload = Partial<{
  full_name: string;
  phone: string;
  profile_pic: string;
}>;
