"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { AddressType, CustomerAddress, CustomerAddressPayload } from "@/types/customer";

const ADDRESS_TYPES: AddressType[] = ["HOME", "OFFICE", "OTHER"];

type Props = {
  customerId: number;
  address?: CustomerAddress | null;
  onSave: (data: CustomerAddressPayload) => Promise<unknown>;
  onClose: () => void;
};

export default function AddressForm({ customerId, address, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    address_type: (address?.address_type ?? "HOME") as AddressType,
    full_name: address?.full_name ?? "",
    phone: address?.phone ?? "",
    province: address?.province ?? "",
    district: address?.district ?? "",
    city: address?.city ?? "",
    ward: address?.ward ?? "",
    address_line: address?.address_line ?? "",
    landmark: address?.landmark ?? "",
    is_default: address?.is_default ?? false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSave({
        customer: customerId,
        address_type: form.address_type,
        full_name: form.full_name,
        phone: form.phone,
        province: form.province,
        district: form.district,
        city: form.city,
        ward: form.ward || null,
        address_line: form.address_line,
        landmark: form.landmark || null,
        is_default: form.is_default,
      });
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;
      setError(
        data?.detail ||
          (data && typeof data === "object" ? Object.values(data).flat().join(" ") : "") ||
          "Failed to save address."
      );
    } finally {
      setLoading(false);
    }
  };

  const cls =
    "w-full bg-slate-900 px-4 py-3 rounded-xl text-white border border-slate-700 focus:border-indigo-500 outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
      <h2 className="text-2xl font-black text-white">{address ? "Edit Address" : "Add Address"}</h2>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <select
          value={form.address_type}
          onChange={(e) => set("address_type", e.target.value)}
          className={cls}
        >
          {ADDRESS_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Full Name" className={cls} />
      </div>

      <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone" className={cls} />

      <div className="grid grid-cols-2 gap-3">
        <input required value={form.province} onChange={(e) => set("province", e.target.value)} placeholder="Province" className={cls} />
        <input required value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="District" className={cls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City" className={cls} />
        <input value={form.ward} onChange={(e) => set("ward", e.target.value)} placeholder="Ward (optional)" className={cls} />
      </div>

      <input required value={form.address_line} onChange={(e) => set("address_line", e.target.value)} placeholder="Address Line" className={cls} />
      <input value={form.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="Landmark (optional)" className={cls} />

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" checked={form.is_default} onChange={(e) => set("is_default", e.target.checked)} className="accent-indigo-500" />
        Set as default address
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Save size={16} />
        {loading ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}
