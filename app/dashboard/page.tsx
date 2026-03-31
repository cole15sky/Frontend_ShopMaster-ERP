"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      case "MANAGER":
        router.push("/dashboard/manager");
        break;
      case "STAFF":
        router.push("/dashboard/staff");
        break;
      default:
        router.push("/login");
    }
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return <p>Redirecting...</p>;
}