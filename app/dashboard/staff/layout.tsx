"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context";
import StaffSidebar from "@/components/staff/StaffSidebar";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login?next=/dashboard/staff"); return; }
    if (user.role !== "STAFF") {
      const routes: Record<string, string> = {
        ADMIN: "/dashboard/admin",
        CUSTOMER: "/dashboard/customer",
      };
      router.replace(routes[user.role] || "/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0A0C14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user.role !== "STAFF") return null;

  return (
    <div className="flex min-h-screen bg-[#0A0C14]">
      <StaffSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
