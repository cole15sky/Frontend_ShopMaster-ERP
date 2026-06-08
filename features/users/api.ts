import API from "@/lib/api";
import type {
  User,
  Staff,
  Customer,
  StaffRegisterPayload,
  CustomerRegisterPayload,
  CustomerUpdatePayload,
} from "@/types/user";

// List all users (admin) — used for dashboard counts
export const getUsers = async (): Promise<User[]> => {
  const res = await API.get("users/");
  return res.data;
};

/* =========================================================
   STAFF (Admin-controlled)
   ========================================================= */

// Create Staff (Admin only) — backend forces role=STAFF
export const registerStaff = async (data: StaffRegisterPayload): Promise<Staff> => {
  const res = await API.post("users/register/", data);
  return res.data;
};

export const getStaff = async (): Promise<Staff[]> => {
  const res = await API.get("users/staff/");
  return res.data;
};

export const getSoftDeletedStaff = async (): Promise<Staff[]> => {
  const res = await API.get("users/staff/soft_deleted/");
  return res.data;
};

export const softDeleteStaff = async (id: number): Promise<void> => {
  await API.delete(`users/staff/${id}/soft_delete/`);
};

export const recoverStaff = async (id: number): Promise<Staff> => {
  const res = await API.patch(`users/staff/${id}/recover/`);
  return res.data;
};

/* =========================================================
   CUSTOMERS (Public registration, Admin/Staff CRUD)
   ========================================================= */

// Customer Registration (Public) — backend forces role=CUSTOMER
export const registerCustomer = async (data: CustomerRegisterPayload): Promise<Customer> => {
  const res = await API.post("users/customers/register/", data);
  return res.data;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await API.get("users/customers/");
  return res.data;
};

export const getSoftDeletedCustomers = async (): Promise<Customer[]> => {
  const res = await API.get("users/customers/soft_deleted/");
  return res.data;
};

export const updateCustomer = async (
  id: number,
  data: CustomerUpdatePayload
): Promise<Customer> => {
  const res = await API.put(`users/customers/${id}/`, data);
  return res.data;
};

export const softDeleteCustomer = async (id: number): Promise<void> => {
  await API.delete(`users/customers/${id}/soft_delete/`);
};

export const recoverCustomer = async (id: number): Promise<Customer> => {
  const res = await API.patch(`users/customers/${id}/recover/`);
  return res.data;
};
