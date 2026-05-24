"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMe } from "./api";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // LOGIN
  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const me = await getMe();
      const userObj = me?.data ?? me;

      setUser(userObj);

      const role = userObj?.role;

      if (role === "ADMIN") router.push("/dashboard/admin");
      else if (role === "STAFF") router.push("/dashboard/staff");
      else router.push("/dashboard/customer");

    } catch (error) {
      console.error("Login failed:", error);
      logout();
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    router.push("/login");
  };

  // AUTO LOGIN
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => {
        const userObj = res?.data ?? res;
        setUser(userObj);
      })
      .catch(() => {
        logout();
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