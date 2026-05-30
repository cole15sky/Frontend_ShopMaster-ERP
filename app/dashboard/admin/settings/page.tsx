"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context";
import { getMe } from "@/features/auth/api";
import { User, Mail, Phone, Briefcase, Shield, Camera, Save } from "lucide-react";
import type { User as UserType } from "@/types/user";

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  STAFF: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CUSTOMER: "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function SettingsPage() {
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
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-pulse h-64" />
      </div>
    );
  }

  if (!profile) return null;

  const fields = [
    { icon: User, label: "Full Name", value: profile.full_name || "—" },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone || "—" },
    { icon: Briefcase, label: "Position", value: profile.position || "—" },
    { icon: Shield, label: "Role", value: profile.role },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* PROFILE CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Profile</h2>

          {/* AVATAR */}
          <div className="flex items-center gap-5 mb-8">
            <div className="relative">
              {profile.profile_pic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profile_pic}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-black">
                  {(profile.full_name || profile.email)[0].toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-slate-800 border border-slate-700 rounded-lg p-1">
                <Camera size={12} className="text-slate-400" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold">{profile.full_name || "No Name"}</p>
              <p className="text-slate-400 text-sm">{profile.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full border font-medium ${ROLE_BADGE[profile.role] || "bg-slate-700 text-slate-300 border-slate-600"}`}>
                {profile.role}
              </span>
            </div>
          </div>

          {/* FIELDS */}
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

        {/* ACCOUNT STATUS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Account</h2>
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl mb-4">
            <div>
              <p className="text-sm font-medium">Account Status</p>
              <p className="text-xs text-slate-500">Your account access level</p>
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

        <p className="text-xs text-slate-600 text-center">
          Profile editing requires contacting an administrator.
        </p>
      </div>
    </div>
  );
}
