"use client";

import { useAuth } from "@/features/auth/context";
export default function AdminDashboard() {
  const { user } = useAuth();

  return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-indigo-600">Admin Dashboard</h1>
        <p className="mt-2">Welcome, {user?.full_name}</p>
      </div>
  );
}
