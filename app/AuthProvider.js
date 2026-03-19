"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMe } from "@/apis/auth";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ important
  const router = useRouter();

  // ✅ LOGIN
  const login = async (email, password) => {
    const data = await loginUser(email, password);

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const me = await getMe();

    setUser(me.data);

    // redirect based on role
    switch (me.data.role) {
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

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    router.push("/login");
  };

  // ✅ AUTO LOGIN ON REFRESH
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      })
      .finally(() => {
        setLoading(false); // ✅ critical
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading, // ✅ add this
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}