"use client";

import { useEffect, useState, useMemo } from "react";
import { RefreshCcw, Search, QrCode, Download } from "lucide-react";
import { getVariants } from "@/features/variants/api";
import type { ProductVariant } from "@/types/product";

export default function QRGeneratePage() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const data = await getVariants();
      setVariants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch variants error:", err);
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVariants(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return variants.filter(
      (v) =>
        v.sku.toLowerCase().includes(q) ||
        (v.color ?? "").toLowerCase().includes(q) ||
        v.size.toLowerCase().includes(q)
    );
  }, [variants, search]);

  const withQR = filtered.filter((v) => v.qr_code);
  const withoutQR = filtered.filter((v) => !v.qr_code);

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">QR Manager</h1>
          <p className="text-slate-400 text-sm mt-1">
            {withQR.length} of {variants.length} variants have QR codes
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
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 animate-pulse h-52" />
          ))}
        </div>
      ) : withQR.length > 0 ? (
        <>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
            QR Codes ({withQR.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {withQR.map((v) => (
              <div
                key={v.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-indigo-500/50 transition"
              >
                <div className="bg-white rounded-xl p-2 w-32 h-32 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.qr_code!}
                    alt={`QR for ${v.sku}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">{v.sku}</p>
                  <p className="text-xs text-slate-400">{v.size} · {v.gender}</p>
                  {v.color && <p className="text-xs text-slate-500">{v.color}</p>}
                  <p className="text-indigo-400 text-sm font-semibold mt-1">${v.price}</p>
                </div>
                <a
                  href={v.qr_code!}
                  download={`qr-${v.sku}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                >
                  <Download size={12} /> Download
                </a>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <QrCode size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No QR codes found for matching variants.</p>
          <p className="text-slate-600 text-sm mt-2">QR codes are generated server-side when variants are created.</p>
        </div>
      )}

      {/* VARIANTS WITHOUT QR */}
      {withoutQR.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            No QR Code ({withoutQR.length})
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-600 border-b border-slate-800">
                  <th className="p-3">SKU</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Color</th>
                  <th className="p-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {withoutQR.map((v) => (
                  <tr key={v.id} className="border-b border-slate-800 text-sm text-slate-400">
                    <td className="p-3 font-mono text-white">{v.sku}</td>
                    <td className="p-3">{v.size}</td>
                    <td className="p-3">{v.gender}</td>
                    <td className="p-3">{v.color || "—"}</td>
                    <td className="p-3">${v.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
