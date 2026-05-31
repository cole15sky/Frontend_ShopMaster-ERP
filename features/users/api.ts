import API from "@/lib/api";
import type { User } from "@/types/user";

export const getUsers = async (): Promise<User[]> => {
  const res = await API.get("users/");
  return res.data;
};

export const getSoftDeletedUsers = async (): Promise<User[]> => {
  const res = await API.get("users/soft-deleted/");
  return res.data;
};

export const softDeleteUser = async (id: number): Promise<void> => {
  await API.delete(`users/${id}/soft-delete/`);
};

export const recoverUser = async (id: number): Promise<User> => {
  const res = await API.patch(`users/${id}/recover/`);
  return res.data;
};

export const updateUser = async (id: number, data: Partial<Omit<User, "id">>): Promise<User> => {
  const res = await API.patch(`users/${id}/recover/`, data);
  return res.data;
};
