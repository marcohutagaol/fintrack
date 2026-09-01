"use client";

import { useState } from "react";
import { Plus, X, ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { createTransaction } from "@/app/actions/transactions";

const EXPENSE_CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Cicilan",
  "Hiburan",
  "Belanja",
  "Kesehatan",
  "Pendidikan",
  "Lainnya",
];

const INCOME_CATEGORIES = ["Gaji", "Bonus", "Investasi", "Freelance", "Lainnya"];

export function QuickAddModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Makanan & Minuman");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const categories = type === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (newType: "EXPENSE" | "INCOME") => {
    setType(newType);
    setCategory(newType === "EXPENSE" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ""));
    if (!numericAmount || isNaN(numericAmount)) {
      alert("Masukkan nominal yang valid");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await createTransaction({
        type,
        amount: numericAmount,
        categoryName: category,
        description: description || category,
        date,
      });

      if (res.success) {
        setMessage("Transaksi berhasil disimpan!");
        setTimeout(() => {
          setIsOpen(false);
          setAmount("");
          setDescription("");
          setMessage(null);
        }, 1000);
      } else {
        setMessage(res.message || "Gagal menyimpan transaksi.");
      }
    } catch (err: any) {
      setMessage(err.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Tambah Transaksi"
        className="fixed bottom-20 lg:bottom-8 right-5 sm:right-8 w-14 h-14 bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-900/40 hover:shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center z-40 group"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-200" />
      </button>

      {/* Modal Overlay & Bottom Sheet Dialog for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-surface-container-lowest dark:bg-zinc-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Sheet Handle */}
            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/40">
              <div>
                <h3 className="font-bold text-lg text-on-surface">
                  Tambah Transaksi
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Catat pengeluaran atau pemasukan baru
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-surface-container-low dark:bg-zinc-800/80 rounded-2xl border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => handleTypeChange("EXPENSE")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    type === "EXPENSE"
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("INCOME")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    type === "INCOME"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Pemasukan
                </button>
              </div>

              {/* Nominal Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Nominal (Rp)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-bold text-on-surface-variant text-base">
                    Rp
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setAmount(val ? parseInt(val, 10).toLocaleString("id-ID") : "");
                    }}
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low dark:bg-zinc-800 rounded-2xl border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-lg font-bold"
                  />
                </div>
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low dark:bg-zinc-800 rounded-2xl border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm font-medium appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keterangan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Makan siang bersama tim"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low dark:bg-zinc-800 rounded-2xl border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
                />
              </div>

              {/* Tanggal */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low dark:bg-zinc-800 rounded-2xl border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
                />
              </div>

              {/* Feedback Message */}
              {message && (
                <p className="text-xs text-center font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 py-2 rounded-xl">
                  {message}
                </p>
              )}

              {/* Submit Button */}
              <div className="pt-2 pb-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Transaksi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
