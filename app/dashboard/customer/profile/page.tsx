"use client";

import { useState } from "react";
import { User, Save, Mail, Phone, Calendar } from "lucide-react";
import ShopGate from "@/components/customer/ShopGate";
import { updateCustomer } from "@/features/shop/api";
import type { Customer } from "@/types/customer";

function ProfileView({ customer }: { customer: Customer }) {
  const [form, setForm] = useState({
    full_name: customer.full_name ?? "",
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    date_of_birth: customer.date_of_birth ?? "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      await updateCustomer(customer.id, {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        date_of_birth: form.date_of_birth || null,
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: any) {
      const data = err?.response?.data;
      setError(
        data?.detail ||
          (data && typeof data === "object" ? Object.values(data).flat().join(" ") : "") ||
          "Failed to update profile."
      );
      setStatus("error");
    }
  };

  const cls =
    "w-full bg-slate-900 pl-11 pr-4 py-3 rounded-xl text-white border border-slate-700 focus:border-indigo-500 outline-none";

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
        <User className="text-indigo-400" /> My Profile
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">
            {(form.full_name || form.email)[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg">{form.full_name || "—"}</p>
            <p className="text-slate-400 text-sm">{form.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Full Name" className={cls} />
          </div>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email" className={cls} />
          </div>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone" className={cls} />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="date" value={form.date_of_birth ?? ""} onChange={(e) => set("date_of_birth", e.target.value)} className={cls} />
          </div>

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <ShopGate>{(customer) => <ProfileView customer={customer} />}</ShopGate>
    </div>
  );
}
