"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { Customer, CustomerUpdatePayload } from "@/types/user";

type Props = {
  customer: Customer;
  onSave: (data: CustomerUpdatePayload) => Promise<unknown>;
  onClose: () => void;
};

export default function CustomerForm({ customer, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    full_name: customer.full_name ?? "",
    phone: customer.phone ?? "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSave({
        full_name: form.full_name,
        phone: form.phone,
      });
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;
      setError(
        data?.detail ||
          (data && typeof data === "object" ? Object.values(data).flat().join(" ") : "") ||
          "Failed to update customer."
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
        <h2 className="text-2xl font-black text-white">Edit Customer</h2>
        <p className="text-slate-500 text-sm mt-1">Update customer profile details.</p>
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
        disabled
        value={customer.email}
        placeholder="Email"
        title="Email cannot be changed"
        className={`${inputCls} opacity-60 cursor-not-allowed`}
      />
      <input
        value={form.phone}
        onChange={(e) => update("phone", e.target.value)}
        placeholder="Phone"
        className={inputCls}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Save size={16} />
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
