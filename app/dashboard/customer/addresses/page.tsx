"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, RefreshCcw, Star } from "lucide-react";
import ShopGate from "@/components/customer/ShopGate";
import UserModal from "@/components/users/UserModal";
import AddressForm from "@/components/customer/AddressForm";
import { useAddresses } from "@/features/shop/hooks";
import type { Customer, CustomerAddress } from "@/types/customer";

function AddressesView({ customer }: { customer: Customer }) {
  const { addresses, loading, add, edit, remove, refresh } = useAddresses(customer.id);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CustomerAddress | null>(null);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (a: CustomerAddress) => {
    setEditing(a);
    setShowForm(true);
  };
  const close = () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MapPin className="text-indigo-400" /> Addresses
          </h1>
          <p className="text-slate-400 text-sm mt-1">{addresses.length} saved address(es)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus size={16} /> Add Address
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-20">
          <MapPin size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">No addresses yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded-lg bg-indigo-500/20 text-indigo-300">
                    {a.address_type}
                  </span>
                  {a.is_default && (
                    <span className="px-2 py-0.5 text-xs rounded-lg bg-green-500/20 text-green-400 flex items-center gap-1">
                      <Star size={10} /> Default
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(a)} className="text-slate-500 hover:text-indigo-400 p-1">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(a.id)} className="text-slate-500 hover:text-red-400 p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-white">{a.full_name}</p>
              <p className="text-sm text-slate-400">{a.phone}</p>
              <p className="text-sm text-slate-400 mt-2">
                {a.address_line}
                {a.landmark ? `, ${a.landmark}` : ""}
              </p>
              <p className="text-sm text-slate-500">
                {[a.ward && `Ward ${a.ward}`, a.city, a.district, a.province].filter(Boolean).join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <UserModal onClose={close}>
          <AddressForm
            customerId={customer.id}
            address={editing}
            onSave={(data) => (editing ? edit(editing.id, data) : add(data))}
            onClose={close}
          />
        </UserModal>
      )}
    </>
  );
}

export default function AddressesPage() {
  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <ShopGate>{(customer) => <AddressesView customer={customer} />}</ShopGate>
    </div>
  );
}
