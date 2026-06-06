"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, Loader2, ShoppingBag, CheckCircle2 } from "lucide-react";
import { registerCustomer } from "@/features/users/api";

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await registerCustomer({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      const data = err?.response?.data;
      setError(
        data?.detail ||
          (data && typeof data === "object" ? Object.values(data).flat().join(" ") : "") ||
          "Registration failed. Please try again."
      );
      setSubmitting(false);
    }
  };

  const inputWrap =
    "w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-[1.2rem] text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f172a] px-4">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 lg:p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-500 rounded-xl shadow-lg shadow-green-500/40">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <span className="text-lg font-bold text-white tracking-tight uppercase">
            ShopApp <span className="text-green-400">Shop</span>
          </span>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
        <p className="text-slate-400 mb-8">Register as a customer to start shopping.</p>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 className="text-green-400" size={48} />
            <p className="text-white font-semibold">Account created!</p>
            <p className="text-slate-400 text-sm">Redirecting you to sign in…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-400 transition-colors" size={20} />
              <input
                required
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                placeholder="Full Name"
                className={inputWrap}
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-400 transition-colors" size={20} />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Email"
                className={inputWrap}
              />
            </div>

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-400 transition-colors" size={20} />
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="Phone (optional)"
                className={inputWrap}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-400 transition-colors" size={20} />
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Password"
                className={inputWrap}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold py-4 rounded-[1.2rem] shadow-xl shadow-green-600/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 group"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        )}

        <p className="text-slate-500 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
