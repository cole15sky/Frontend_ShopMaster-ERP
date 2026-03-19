"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      switch (user.role) {
        case "ADMIN":
          router.replace("/dashboard/admin");
          break;
        case "STAFF":
          router.replace("/dashboard/staff");
          break;
        case "CUSTOMER":
          router.replace("/dashboard/customer");
          break;
        default:
          router.replace("/login");
      }
    }
  }, [user, loading]);

  if (loading) return <p>Loading...</p>;

  if (!user) return null;

  if (!allowedRoles.includes(user.role)) return null;

  return children;
}