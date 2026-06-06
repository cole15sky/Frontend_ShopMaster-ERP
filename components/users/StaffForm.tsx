"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { StaffRegisterPayload } from "@/types/user";

type Props = {
  onSave: (data: StaffRegisterPayload) => Promise<unknown>;
  onClose: () => void;
};

export default function StaffForm({ onSave, onClose }: Props) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: "",
    phone: "",
    position: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        password2: form.password2,
        phone: form.phone || undefined,
        position: form.position || undefined,
      });
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;
      setError(
        data?.detail ||
          (data && typeof data === "object" ? Object.values(data).flat().join(" ") : "") ||
          "Failed to create staff member."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-slate-900 px-4 py-3 rounded-xl text-white border border-slate-700 focus:border-indigo-500 outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">Create Staff Member</h2>
        <p className="text-slate-500 text-sm mt-1">Role is automatically set to STAFF.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <input
        required
        value={form.full_name}
        onChange={(e) => update("full_name", e.target.value)}
        placeholder="Full Name"
        className={inputCls}
      />
      <input
        required
        type="email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        placeholder="Email"
        className={inputCls}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Phone"
          className={inputCls}
        />
        <input
          value={form.position}
          onChange={(e) => update("position", e.target.value)}
          placeholder="Position (e.g. Manager)"
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          required
          type="password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder="Password"
          className={inputCls}
        />
        <input
          required
          type="password"
          value={form.password2}
          onChange={(e) => update("password2", e.target.value)}
          placeholder="Confirm Password"
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Save size={16} />
        {loading ? "Creating..." : "Create Staff"}
      </button>
    </form>
  );
}
