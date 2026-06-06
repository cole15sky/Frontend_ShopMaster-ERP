"use client";

import { useState } from "react";
import { Star, Plus, Trash2, RefreshCcw, Save } from "lucide-react";
import ShopGate from "@/components/customer/ShopGate";
import UserModal from "@/components/users/UserModal";
import { useReviews, useVariantMap } from "@/features/shop/hooks";
import type { Customer } from "@/types/customer";

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={onChange ? 24 : 16}
            className={n <= value ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({
  customerId,
  onClose,
}: {
  customerId: number;
  onClose: () => void;
}) {
  const { products } = useVariantMap();
  const { add } = useReviews(customerId);
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      setError("Select a product.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await add({ customer: customerId, product: Number(productId), rating, comment: comment || null });
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;
      setError(
        data?.detail ||
          (data && typeof data === "object" ? Object.values(data).flat().join(" ") : "") ||
          "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-black text-white">Write a Review</h2>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="w-full bg-slate-900 px-4 py-3 rounded-xl text-white border border-slate-700 focus:border-indigo-500 outline-none text-sm"
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <div>
        <p className="text-sm text-slate-400 mb-2">Rating</p>
        <Stars value={rating} onChange={setRating} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Your review (optional)"
        rows={4}
        className="w-full bg-slate-900 px-4 py-3 rounded-xl text-white border border-slate-700 focus:border-indigo-500 outline-none text-sm resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Save size={16} />
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

function ReviewsView({ customer }: { customer: Customer }) {
  const { mine, loading, remove, refresh } = useReviews(customer.id);
  const { products } = useVariantMap();
  const [showForm, setShowForm] = useState(false);

  const productName = (id: number) => products.find((p) => p.id === id)?.name ?? `Product #${id}`;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Star className="text-yellow-400" /> My Reviews
          </h1>
          <p className="text-slate-400 text-sm mt-1">{mine.length} review(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus size={16} /> Write Review
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : mine.length === 0 ? (
        <div className="text-center py-20">
          <Star size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">You haven’t written any reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mine.map((r) => (
            <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">{productName(r.product)}</p>
                  <div className="mt-1">
                    <Stars value={r.rating} />
                  </div>
                </div>
                <button onClick={() => remove(r.id)} className="text-slate-500 hover:text-red-400 p-1">
                  <Trash2 size={15} />
                </button>
              </div>
              {r.comment && <p className="text-slate-400 text-sm mt-3">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <UserModal onClose={() => setShowForm(false)}>
          <ReviewForm customerId={customer.id} onClose={() => setShowForm(false)} />
        </UserModal>
      )}
    </>
  );
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <ShopGate>{(customer) => <ReviewsView customer={customer} />}</ShopGate>
    </div>
  );
}
