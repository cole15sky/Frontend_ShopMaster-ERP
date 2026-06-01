"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context";
import { getMe } from "@/features/auth/api";
import { User, Mail, Phone, Briefcase, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import type { User as UserType } from "@/types/user";

export default function CustomerSettingsPage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => setProfile(data?.data ?? data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C14] text-white p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-pulse h-64 max-w-2xl" />
      </div>
    );
  }

  if (!profile) return null;

  const fields = [
    { icon: User, label: "Full Name", value: profile.full_name || "—" },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone || "—" },
    { icon: Briefcase, label: "Position", value: profile.position || "—" },
    { icon: Shield, label: "Account Type", value: profile.role },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="max-w-2xl space-y-6">
        {/* TRIAL CTA */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-indigo-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white text-sm">Free Trial Active</p>
              <p className="text-slate-400 text-xs">Explore all ERP features during your trial period.</p>
            </div>
          </div>
          <Link
            href="/trial"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition whitespace-nowrap"
          >
            View Trial
          </Link>
        </div>

        {/* PROFILE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Profile Information</h2>

          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-black flex-shrink-0">
              {(profile.full_name || profile.email)[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-bold">{profile.full_name || "Customer"}</p>
              <p className="text-slate-400 text-sm">{profile.email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full border bg-green-500/20 text-green-400 border-green-500/30 font-medium">
                {profile.role}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {fields.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Icon size={16} className="text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-0.5">{f.label}</p>
                    <p className="text-sm text-white font-medium">{f.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl mb-4">
            <div>
              <p className="text-sm font-medium">Account Status</p>
              <p className="text-xs text-slate-500">Your current access level</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {profile.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
