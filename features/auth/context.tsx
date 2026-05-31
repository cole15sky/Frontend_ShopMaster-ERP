"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMe } from "./api";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  STAFF: "/dashboard/staff",
  CUSTOMER: "/dashboard/customer",
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = async (email: string, password: string, redirectTo?: string) => {
    const data = await loginUser(email, password);

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const me = await getMe();
    const userObj: User = me?.data ?? me;

    setUser(userObj);

    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.push(ROLE_ROUTES[userObj?.role] ?? "/login");
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => {
        const userObj: User = res?.data ?? res;
        setUser(userObj);
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
