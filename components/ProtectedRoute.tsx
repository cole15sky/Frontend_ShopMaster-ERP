"use client";

import { useEffect } from "react";
import { useAuth } from "@/features/auth/context";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (pathname !== "/login") router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      const roleRoutes: Record<string, string> = {
        ADMIN: "/dashboard/admin",
        STAFF: "/dashboard/staff",
        CUSTOMER: "/dashboard/customer",
      };
      const target = roleRoutes[user.role] || "/login";
      if (pathname !== target) router.replace(target);
    }
  }, [user, loading, router, allowedRoles, pathname]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;
  if (!allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
