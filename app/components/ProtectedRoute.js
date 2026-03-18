"use client";

import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return; // still loading
    if (!allowedRoles.includes(user.role)) {
      logout(); // log out unauthorized users
    }
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return <>{children}</>;
}