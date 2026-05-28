"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!user || user.role !== "ADMIN"){
      const roleRoutes: Record<string, string> = {
        STAFF: "/dashboard/staff",
        CUSTOMER: "/dashboard/customer",
      };
      router.replace(roleRoutes[user.role] || "/login");
    }
  }, [user, loading, router]);

if (loading || !user) {
  return <p>Loading...</p>;
}

if (user.role !== "ADMIN") {
  return <p>Loading...</p>;
}

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}