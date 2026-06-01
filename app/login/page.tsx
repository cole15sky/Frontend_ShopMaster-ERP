"use client";

import { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Store, ArrowRight, Loader2, Sparkles, ScanLine } from "lucide-react";

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  STAFF: "/dashboard/staff",
  CUSTOMER: "/dashboard/customer",
};

function LoginContent() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;

    // honour ?next= param first, then fall back to role route
    router.replace(next || ROLE_ROUTES[user.role] || "/login");
  }, [user, authLoading, router, next]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // pass next so context redirects there after login
      await login(email, password, next || undefined);
    } catch {
      setError("Authentication failed. Please check your credentials.");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f172a]">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl m-4 overflow-hidden"
      >
        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600/20 to-transparent border-r border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/50">
              <Store className="text-white" size={28} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight uppercase">
              ShopApp <span className="text-indigo-400">OS</span>
            </span>
          </div>

          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-5xl font-bold text-white leading-[1.1] mb-6">
                Next-Gen <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Retail Intelligence
                </span>
              </h1>
              <p className="text-slate-400 text-lg max-w-sm mb-8 leading-relaxed">
                Seamlessly bridge your offline billing with global e-commerce and real-time stock tracking.
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                { icon: <ScanLine />, label: "Quick QR Checkout" },
                { icon: <Sparkles />, label: "AI Inventory Forecast" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 text-white/80 text-sm font-medium bg-white/5 p-4 rounded-2xl border border-white/5 w-fit"
                >
                  <span className="text-indigo-400">{item.icon}</span>
                  {item.label}
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-slate-500 text-xs">Empowering 2,400+ modern retailers globally.</p>
        </div>

        {/* RIGHT */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-black/20">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-slate-400">
              {next ? "Sign in to continue to your destination." : "Welcome back! Please enter your details."}
            </p>
            {next && (
              <div className="mt-3 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl inline-block">
                <p className="text-indigo-400 text-xs">
                  You'll be redirected to <span className="font-mono font-semibold">{next}</span> after sign in.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-[1.2rem] text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  placeholder="name@shop.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-[1.2rem] text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-4 rounded-[1.2rem] shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Access Terminal
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-600 text-xs">OR</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <button
              type="button"
              onClick={() => router.push("/auth/register")}
              className="w-full py-3 rounded-[1.2rem] border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition"
            >
              Start Free Trial — Create Account
            </button>

            <p className="text-slate-600 text-xs pt-1">
              Secured with Enterprise 256-bit encryption.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <LoginContent />
    </Suspense>
  );
}
