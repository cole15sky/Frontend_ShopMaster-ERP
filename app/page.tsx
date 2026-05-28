"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Boxes,
  CreditCard,
  ShieldCheck,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";


export default function Home() {
  const modules = [
    {
      title: "Inventory",
      desc: "Realtime inventory & warehouse management.",
      icon: Warehouse,
    },
    {
      title: "Analytics",
      desc: "Track sales, revenue & business growth.",
      icon: BarChart3,
    },
    {
      title: "POS System",
      desc: "Fast billing system for modern businesses.",
      icon: ShoppingCart,
    },
    {
      title: "CRM",
      desc: "Manage customer relationships efficiently.",
      icon: Users,
    },
    {
      title: "Accounting",
      desc: "Invoices, payments & financial tracking.",
      icon: CreditCard,
    },
    {
      title: "Operations",
      desc: "Control all ERP workflows in one place.",
      icon: Boxes,
    },
  ];

  const stats = [
    {
      value: "500+",
      label: "Businesses",
    },
    {
      value: "1M+",
      label: "Orders",
    },
    {
      value: "99.9%",
      label: "Uptime",
    },
    {
      value: "$12M+",
      label: "Revenue",
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#020617] text-white">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full" />
      </div>

      {/* HERO */}
      <section className="relative z-10 px-6 lg:px-20 pt-28 pb-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 backdrop-blur-xl mb-8">
              <ShieldCheck size={18} className="text-green-400" />
              <span className="text-sm text-gray-300">
                Modern Cloud ERP Platform
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              Smart ERP For
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Modern Businesses
              </span>
            </h1>

            <p className="mt-8 text-lg text-gray-400 leading-relaxed max-w-2xl">
              ShopMaster ERP helps businesses automate inventory, billing,
              analytics, customer management, sales, and warehouse operations
              from one intelligent platform.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold shadow-2xl shadow-indigo-500/30"
              >
                Start Free Trial
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl font-semibold hover:bg-white/10 transition"
              >
                <Link href="/auth/register">
                  Book Demo
                </Link>
              </motion.button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
              {stats.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
                >
                  <h2 className="text-3xl font-black text-indigo-400">
                    {item.value}
                  </h2>

                  <p className="text-sm text-gray-400 mt-2">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT DASHBOARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="relative rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_0_80px_rgba(99,102,241,0.25)]"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">ERP Dashboard</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Realtime business analytics
                  </p>
                </div>

                <div className="bg-green-500/20 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm">
                  Live Data
                </div>
              </div>

              {/* TOP CARDS */}
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div className="bg-[#111827] rounded-3xl p-6 border border-white/5">
                  <p className="text-sm text-gray-400">Revenue</p>

                  <h3 className="text-4xl font-black mt-3">$128K</h3>

                  <span className="text-green-400 text-sm mt-3 inline-block">
                    +18% Growth
                  </span>
                </div>

                <div className="bg-[#111827] rounded-3xl p-6 border border-white/5">
                  <p className="text-sm text-gray-400">Orders</p>

                  <h3 className="text-4xl font-black mt-3">12,450</h3>

                  <span className="text-indigo-400 text-sm mt-3 inline-block">
                    Realtime
                  </span>
                </div>
              </div>

              {/* GRAPH */}
              <div className="bg-[#111827] rounded-3xl p-6 border border-white/5 mb-5">
                <div className="flex items-end gap-3 h-56">
                  {[40, 90, 70, 140, 120, 180, 160].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.5,
                      }}
                      className="flex-1 rounded-t-2xl bg-gradient-to-t from-indigo-500 to-purple-500"
                    />
                  ))}
                </div>
              </div>

              {/* SMALL CARDS */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-[#111827] rounded-3xl p-5 border border-white/5">
                  <p className="text-sm text-gray-400">Low Stock Alert</p>

                  <h3 className="text-2xl font-bold mt-2">14 Products</h3>
                </div>

                <div className="bg-[#111827] rounded-3xl p-5 border border-white/5">
                  <p className="text-sm text-gray-400">Active Customers</p>

                  <h3 className="text-2xl font-bold mt-2">8,240</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MODULES */}
      <section className="relative z-10 px-6 lg:px-20 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-6xl font-black">
            Powerful ERP Modules
          </h2>

          <p className="text-gray-400 text-lg mt-6">
            Everything your business needs in one powerful ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => {
            const Icon = module.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -10,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl">
                    <Icon size={30} />
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    {module.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {module.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-20 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-indigo-600 to-purple-600 p-12 lg:p-20 text-center"
        >
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-black leading-tight">
              Start Growing With ShopMaster ERP
            </h2>

            <p className="text-lg text-white/80 mt-6 max-w-2xl mx-auto">
              Manage inventory, sales, customers, and analytics from one
              intelligent business platform.
            </p>

            <div className="flex flex-wrap justify-center gap-5 mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-white text-black font-bold"
              >
                Get Started
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl font-bold"
              >
                Contact Sales
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}