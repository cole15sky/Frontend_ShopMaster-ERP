"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context";
import CustomerSidebar from "@/components/customer/CustomerSidebar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login?next=/dashboard/customer"); return; }
    if (user.role !== "CUSTOMER") {
      const routes: Record<string, string> = {
        ADMIN: "/dashboard/admin",
        STAFF: "/dashboard/staff",
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

  if (user.role !== "CUSTOMER") return null;

  return (
    <div className="flex min-h-screen bg-[#0A0C14]">
      <CustomerSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
