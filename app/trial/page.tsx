"use client";

import { useAuth } from "@/features/auth/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, Warehouse, BarChart3, ShoppingCart,
  Users, CreditCard, Boxes, ArrowRight, Sparkles,
} from "lucide-react";
import Link from "next/link";

const TRIAL_FEATURES = [
  { icon: Warehouse, title: "Inventory Management", desc: "Track stock in real-time across all variants and locations.", href: "/dashboard/admin/inventory" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Business insights — product performance, stock levels, user data.", href: "/dashboard/admin/analytics" },
  { icon: ShoppingCart, title: "Sales & Orders", desc: "Manage and process all customer orders in one place.", href: "/dashboard/admin/sales" },
  { icon: Users, title: "User Management", desc: "Manage staff, customers and admin roles.", href: "/dashboard/admin/users" },
  { icon: Boxes, title: "Product Catalog", desc: "Create and manage products with full variant support.", href: "/dashboard/admin/products" },
  { icon: CreditCard, title: "Payments", desc: "Revenue tracking and payment history.", href: "/dashboard/admin/payments" },
];

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  STAFF: "/dashboard/staff",
  CUSTOMER: "/dashboard/customer",
};

export default function TrialPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?next=/trial");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const dashboardRoute = ROLE_ROUTES[user.role] ?? "/dashboard";

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm mb-6">
            <ShieldCheck size={16} />
            Free Trial Active — Authenticated as <span className="font-semibold">{user.full_name ?? user.email}</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
            Welcome to Your
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Free Trial
            </span>
          </h1>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            You have full access to all ShopMaster ERP modules. Explore the features below or jump straight into your dashboard.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={dashboardRoute}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold shadow-2xl shadow-indigo-500/30"
              >
                <Sparkles size={18} />
                Go to Dashboard
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* TRIAL FEATURES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRIAL_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  href={feature.href}
                  className="group block bg-white/5 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5 shadow-xl">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  <div className="flex items-center gap-2 mt-4 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* TRIAL INFO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white/5 border border-white/10 rounded-2xl px-8 py-5 backdrop-blur-xl">
            <p className="text-slate-400 text-sm">
              Logged in as <span className="text-white font-semibold">{user.email}</span>
              {" · "}Role: <span className="text-indigo-400 font-semibold">{user.role}</span>
            </p>
            <p className="text-slate-500 text-xs mt-2">
              All ERP features are available during your free trial period.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
