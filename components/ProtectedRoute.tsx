"use client";

import { useEffect } from "react";
import { useAuth } from "@/features/auth/context";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  STAFF: "/dashboard/staff",
  CUSTOMER: "/dashboard/customer",
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      const target = ROLE_ROUTES[user.role] || "/login";
      router.replace(target);
    }
  }, [user, loading, router, allowedRoles, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
