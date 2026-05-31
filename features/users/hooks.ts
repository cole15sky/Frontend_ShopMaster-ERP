"use client";

import { useEffect, useState } from "react";
import { getUsers, softDeleteUser, recoverUser, getSoftDeletedUsers } from "./api";
import type { User } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [active, deleted] = await Promise.all([getUsers(), getSoftDeletedUsers()]);
      setUsers(Array.isArray(active) ? active : []);
      setDeletedUsers(Array.isArray(deleted) ? deleted : []);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id: number) => {
    try {
      await softDeleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error("Soft delete error:", err);
      throw err;
    }
  };

  const restoreUser = async (id: number) => {
    try {
      await recoverUser(id);
      await fetchUsers();
    } catch (err) {
      console.error("Recover error:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, deletedUsers, loading, removeUser, restoreUser, refresh: fetchUsers };
}
