"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import ProductForm from "./ProductForm";

export default function ProductModal({ product, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* 1. Animated Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Close when clicking outside
        className="absolute inset-0 bg-[#0B0F1A]/80 backdrop-blur-md"
      />

      {/* 2. Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-[#111625] border border-slate-800 shadow-2xl rounded-[2rem] p-8 md:p-10 overflow-hidden"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        {/* Close Icon (Top Right) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-slate-800/50 rounded-full transition-all group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* The Form */}
        <ProductForm 
          product={product} 
          onSave={onSave} 
          onClose={onClose} 
        />
      </motion.div>
    </div>
  );
}