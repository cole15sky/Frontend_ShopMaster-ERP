"use client";

import { useEffect } from "react";
import { useAuth } from "@/features/auth/context";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    const routes: Record<string, string> = {
      ADMIN: "/dashboard/admin",
      STAFF: "/dashboard/staff",
      CUSTOMER: "/dashboard/customer",
    };
    router.replace(routes[user.role] || "/login");
  }, [user, loading, router]);

  return <p className="p-8">Redirecting...</p>;
}