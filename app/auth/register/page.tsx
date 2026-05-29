"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    business_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("auth/register/", formData);
      const data = res.data;

      localStorage.setItem("token", data.access || "");
      router.push("/onboarding/business");
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-6">
      <div className="w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-10">
        <h1 className="text-4xl font-black mb-8 text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="full_name"
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-4 rounded-2xl bg-[#0f172a] border border-white/10"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-4 rounded-2xl bg-[#0f172a] border border-white/10"
          />
          <input
            name="business_name"
            onChange={handleChange}
            placeholder="Business Name"
            className="w-full p-4 rounded-2xl bg-[#0f172a] border border-white/10"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-4 rounded-2xl bg-[#0f172a] border border-white/10"
          />
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold hover:scale-[1.02] transition"
          >
            Start Free Trial
          </button>
        </form>
      </div>
    </div>
  );
}
