"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMe } from "./api";
import { useRouter } from "next/navigation";

const AuthContext = createContext({ user: null, loading: true, login: async () => {}, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //  LOGIN
  const login = async (email, password) => {
    const data = await loginUser(email, password);

    // store tokens
    localStorage.setItem("access", data.access ?? data.token ?? "");
    localStorage.setItem("refresh", data.refresh ?? "");

    // fetch user — support both res.data and direct object shapes
    const me = await getMe();
    const userObj = me?.data ?? me;

    setUser(userObj);

    // redirect based on role (guard against missing role)
    switch (userObj?.role) {
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      case "STAFF":
        router.push("/dashboard/staff");
        break;
      case "CUSTOMER":
        router.push("/dashboard/customer");
        break;
      default:
        router.push("/login");
    }
  };

  //  LOGOUT
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    router.push("/login");
  };

  //  AUTO LOGIN
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => {
        const u = res?.data ?? res;
        setUser(u);
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