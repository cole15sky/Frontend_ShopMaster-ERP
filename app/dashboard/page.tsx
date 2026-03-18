"use client";

import { useAuth } from "../AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>Not logged in</p>;

  return <h1>Welcome {user.full_name}</h1>;
}