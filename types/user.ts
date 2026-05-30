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
};
