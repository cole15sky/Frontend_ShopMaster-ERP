export type User = {
  id: string;
  name: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
};