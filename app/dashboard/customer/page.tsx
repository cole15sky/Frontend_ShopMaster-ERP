"use client";

import { useAuth } from "@/features/auth/context";
import { motion } from "framer-motion";
import {
  Package, Sparkles, ArrowRight, ShieldCheck,
  BarChart3, QrCode, ShoppingCart,
} from "lucide-react";
import Link from "next/link";

const TRIAL_FEATURES = [
  { icon: Package, title: "Browse Products", desc: "Explore the full product catalog with variant details.", href: "/products" },
  { icon: QrCode, title: "QR Codes", desc: "View product QR codes for quick scanning.", href: "/dashboard/customer/products" },
  { icon: BarChart3, title: "Pricing & Discounts", desc: "View live pricing, discounts, and cost breakdowns.", href: "/dashboard/customer/products" },
  { icon: ShoppingCart, title: "All Variants", desc: "Browse all SKUs by size, gender, and color.", href: "/dashboard/customer/products" },
];

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      {/* WELCOME */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black">
          Welcome, <span className="text-indigo-400">{user?.full_name ?? user?.email}</span>
        </h1>
        <p className="text-slate-400 mt-1">You're on the free trial. Explore what ShopMaster ERP has to offer.</p>
      </motion.div>

      {/* TRIAL STATUS BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
            <ShieldCheck size={24} className="text-indigo-400" />
          </div>
          <div>
            <p className="font-bold text-white">Free Trial Active</p>
            <p className="text-slate-400 text-sm">You have full access to explore all product features.</p>
          </div>
        </div>
        <Link
          href="/trial"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition whitespace-nowrap"
        >
          <Sparkles size={16} />
          Trial Hub
        </Link>
      </motion.div>

      {/* FEATURE CARDS */}
      <div>
        <h2 className="text-lg font-bold text-slate-300 mb-4">Available Features</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {TRIAL_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
              >
                <Link
                  href={feature.href}
                  className="group flex items-start gap-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition-all"
                >
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex-shrink-0 mt-0.5">
                    <Icon size={20} className="text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{feature.title}</p>
                    <p className="text-slate-400 text-sm mt-1">{feature.desc}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PROFILE SNIPPET */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between"
      >
        <div>
          <p className="text-sm text-slate-400">Signed in as</p>
          <p className="font-semibold text-white">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
            {user?.role}
          </span>
        </div>
        <Link
          href="/dashboard/customer/settings"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
        >
          My Profile <ArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}
