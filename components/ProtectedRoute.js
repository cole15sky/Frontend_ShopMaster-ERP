"use client";

import { useEffect } from "react";
import { useAuth } from "@/features/auth/context";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Not logged in → go login (only if not already on the login page)
    if (!user) {
      if (pathname !== "/login") router.replace("/login");
      return;
    }

    // Role not allowed → redirect properly (avoid redirecting if already on target)
    if (!allowedRoles.includes(user.role)) {
      const roleRoutes = {
        ADMIN: "/dashboard/admin",
        STAFF: "/dashboard/staff",
        CUSTOMER: "/dashboard/customer",
      };

      const target = roleRoutes[user.role] || "/login";
      if (pathname !== target) router.replace(target);
    }
  }, [user, loading, router, allowedRoles, pathname]);

  //  WAIT for auth
  if (loading) return <p>Loading...</p>;

  //  block render while redirecting
  if (!user) return null;

  if (!allowedRoles.includes(user.role)) return null;

  return children;
}