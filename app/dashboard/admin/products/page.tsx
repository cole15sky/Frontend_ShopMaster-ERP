    "use client";

    import { useEffect, useState } from "react";
    import { getProducts } from "@/apis/products";
    import { motion, AnimatePresence } from "framer-motion";
    import { 
    Package, 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    ExternalLink,
    Edit3,
    Trash2
    } from "lucide-react";

    export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
        const res = await getProducts();
        setProducts(res.data);
        } catch (error) {
        console.error("Failed to fetch products", error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Package className="text-indigo-600" size={24} />
                Inventory Management
            </h1>
            <p className="text-sm text-slate-500">Manage your product catalog, stock, and variants.</p>
            </div>
            <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-100"
            >
            <Plus size={18} />
            Add Product
            </motion.button>
        </div>

        {/* Stats Quick-View */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium uppercase">Total Items</p>
            <p className="text-xl font-bold text-slate-900">{products.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium uppercase">Active</p>
            <p className="text-xl font-bold text-emerald-600">
                {products.filter(p => p.status === 'ACTIVE').length}
            </p>
            </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                <Filter size={16} /> Filter
            </button>
            </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Brand / Category</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Variants</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                    {products.map((p, index) => (
                    <motion.tr 
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-50/80 transition-colors group"
                    >
                        <td className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                            <Package size={20} />
                            </div>
                            <span className="font-semibold text-slate-700">{p.name}</span>
                        </div>
                        </td>
                        <td className="p-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">{p.brand?.name}</span>
                            <span className="text-xs text-slate-400">{p.category?.name}</span>
                        </div>
                        </td>
                        <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            p.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                            {p.status}
                        </span>
                        </td>
                        <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">
                            {p.variants.length} SKU
                        </span>
                        </td>
                        <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                            <Edit3 size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg transition">
                            <MoreHorizontal size={16} />
                            </button>
                        </div>
                        </td>
                    </motion.tr>
                    ))}
                </AnimatePresence>
                </tbody>
            </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-sm text-slate-500">
            <span>Showing {products.length} products</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition disabled:opacity-50">Previous</button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition">Next</button>
            </div>
            </div>
        </div>
        </div>
    );
    }