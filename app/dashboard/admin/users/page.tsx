"use client";

import Link from "next/link";
import { Briefcase, ShoppingBag, ArrowRight } from "lucide-react";

const CARDS = [
  {
    title: "Staff",
    desc: "Admin-controlled internal users. Create, list, soft delete and recover staff members.",
    href: "/dashboard/admin/users/staff",
    icon: Briefcase,
    accent: "text-indigo-400",
    ring: "hover:border-indigo-500/50",
  },
  {
    title: "Customers",
    desc: "Public users who self-register. Edit profiles, soft delete and recover customers.",
    href: "/dashboard/admin/users/customers",
    icon: ShoppingBag,
    accent: "text-green-400",
    ring: "hover:border-green-500/50",
  },
];

export default function UsersOverviewPage() {
  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-slate-500 text-sm mt-1">Manage staff and customer accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className={`group bg-slate-900 border border-slate-800 rounded-2xl p-6 transition ${c.ring}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Icon size={22} className={c.accent} />
                </div>
                <ArrowRight
                  size={20}
                  className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition"
                />
              </div>
              <h2 className="text-xl font-bold">{c.title}</h2>
              <p className="text-slate-500 text-sm mt-2">{c.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
