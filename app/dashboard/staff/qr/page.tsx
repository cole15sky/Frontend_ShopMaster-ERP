"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, RefreshCcw, QrCode, Download, X } from "lucide-react";
import { getVariants } from "@/features/variants/api";
import type { ProductVariant } from "@/types/product";

export default function StaffQRPage() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<ProductVariant | null>(null);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const data = await getVariants();
      setVariants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVariants(); }, []);

  const withQR = useMemo(() => {
    const q = search.toLowerCase();
    return variants.filter(
      (v) =>
        v.qr_code &&
        (v.sku.toLowerCase().includes(q) ||
          (v.color ?? "").toLowerCase().includes(q) ||
          v.size.toLowerCase().includes(q))
    );
  }, [variants, search]);

  const withoutQR = variants.filter((v) => !v.qr_code).length;

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">QR Manager</h1>
          <p className="text-slate-400 text-sm mt-1">
            {withQR.length} QR codes available · {withoutQR} variants without QR
          </p>
        </div>
        <button onClick={fetchVariants} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl mb-6">
        <Search size={16} className="text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by SKU, size, color..."
          className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-slate-600"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white">
            <X size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 animate-pulse h-52" />
          ))}
        </div>
      ) : withQR.length === 0 ? (
        <div className="text-center py-16">
          <QrCode size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">
            {search ? "No matching QR codes found." : "No QR codes available yet."}
          </p>
          <p className="text-slate-600 text-sm mt-2">QR codes are generated when variants are created.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {withQR.map((v) => (
            <div
              key={v.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer transition"
              onClick={() => setPreview(v)}
            >
              <div className="bg-white rounded-xl p-2 w-28 h-28 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.qr_code!} alt={`QR ${v.sku}`} className="w-full h-full object-contain" />
              </div>
              <div className="text-center w-full">
                <p className="font-bold text-sm truncate">{v.sku}</p>
                <p className="text-xs text-slate-400">{v.size} · {v.gender}</p>
                {v.color && <p className="text-xs text-slate-500">{v.color}</p>}
                <p className="text-indigo-400 text-sm font-semibold mt-1">${v.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div onClick={() => setPreview(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-5 z-10">
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="bg-white rounded-2xl p-4 w-52 h-52 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.qr_code!} alt={`QR ${preview.sku}`} className="w-full h-full object-contain" />
            </div>

            <div className="text-center">
              <p className="text-xl font-black">{preview.sku}</p>
              <p className="text-slate-400 text-sm">{preview.size} · {preview.gender} {preview.color ? `· ${preview.color}` : ""}</p>
              <p className="text-indigo-400 font-bold mt-1">${preview.price}</p>
              {preview.discount_price && (
                <p className="text-green-400 text-sm">${preview.discount_price} sale</p>
              )}
              {preview.barcode && (
                <p className="text-slate-500 text-xs font-mono mt-2">{preview.barcode}</p>
              )}
            </div>

            <a
              href={preview.qr_code!}
              download={`qr-${preview.sku}.png`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition"
            >
              <Download size={16} /> Download QR Code
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
