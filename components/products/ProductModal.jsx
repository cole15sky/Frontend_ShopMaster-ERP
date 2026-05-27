"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import ProductForm from "./ProductForm";

export default function ProductModal({ product, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <motion.div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* MODAL */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-xl mx-4 bg-slate-950 border border-slate-800 rounded-2xl p-6"
      >

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white"
        >
          <X />
        </button>

        <ProductForm
          product={product}
          onSave={onSave}
          onClose={onClose}
        />

      </motion.div>

    </div>
  );
}