"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/features/auth/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    business_name: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await registerUser(formData);
      if (data.access) localStorage.setItem("access", data.access);
      if (data.refresh) localStorage.setItem("refresh", data.refresh);
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-6">
      <div className="w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-10">
        <h1 className="text-4xl font-black mb-8 text-center">Create Account</h1>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="full_name"
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full p-4 rounded-2xl bg-[#0f172a] border border-white/10 focus:border-indigo-500 outline-none"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-4 rounded-2xl bg-[#0f172a] border border-white/10 focus:border-indigo-500 outline-none"
          />
          <input
            name="business_name"
            onChange={handleChange}
            placeholder="Business Name"
            className="w-full p-4 rounded-2xl bg-[#0f172a] border border-white/10 focus:border-indigo-500 outline-none"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-4 rounded-2xl bg-[#0f172a] border border-white/10 focus:border-indigo-500 outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold hover:scale-[1.02] transition disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Start Free Trial"}
          </button>
        </form>
      </div>
    </div>
  );
}
