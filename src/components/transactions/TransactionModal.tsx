"use client";

import { useState, useEffect } from "react";
import { X, ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/transactions";
import {
  TransactionItem,
  CreateTransactionInput,
} from "@/types/transaction";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: TransactionItem | null;
}

const EXPENSE_CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Belanja",
  "Tagihan",
  "Tempat Tinggal",
  "Cicilan",
  "Kesehatan",
  "Hiburan",
  "Pendidikan",
  "Lainnya",
];

const INCOME_CATEGORIES = ["Gaji", "Bonus", "Investasi", "Freelance", "Lainnya"];

export function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: TransactionModalProps) {
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Makanan & Minuman");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDescription(initialData.description);
      const d = new Date(initialData.date);
      setDate(!isNaN(d.getTime()) ? d.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    } else {
      setType("EXPENSE");
      setAmount("");
      setCategory("Makanan & Minuman");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    }
    setErrorMsg(null);
  }, [initialData, isOpen]);

  const categories = type === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (newType: "EXPENSE" | "INCOME") => {
    setType(newType);
    setCategory(newType === "EXPENSE" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ""));
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg("Masukkan nominal yang valid");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (isEditing && initialData) {
        const res = await updateTransaction({
          id: initialData.id,
          type,
          amount: numericAmount,
          categoryName: category,
          description: description || category,
          date,
        });

        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = await createTransaction({
          type,
          amount: numericAmount,
          categoryName: category,
          description: description || category,
          date,
        });

        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err: any) {
      setErrorMsg("Terjadi kesalahan sistem saat menyimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-surface-container-lowest dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/60 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/40 bg-surface-container-low/50 dark:bg-zinc-800/50">
          <h3 className="font-bold text-lg text-on-surface">
            {isEditing ? "Edit Transaksi" : "Tambah Transaksi"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b border-outline-variant/40 mb-5">
            <button
              type="button"
              onClick={() => handleTypeChange("EXPENSE")}
              className={`flex-1 py-2.5 text-xs uppercase tracking-wider font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                type === "EXPENSE"
                  ? "border-primary text-primary dark:text-emerald-400"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-error" />
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("INCOME")}
              className={`flex-1 py-2.5 text-xs uppercase tracking-wider font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                type === "INCOME"
                  ? "border-primary text-primary dark:text-emerald-400"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-secondary" />
              Pemasukan
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nominal */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                Nominal (Rupiah)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-base">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-11 pr-3 py-2.5 border border-outline-variant/60 rounded-xl bg-surface-container-lowest dark:bg-zinc-800 text-on-surface font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Tanggal */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                Tanggal
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-outline-variant/60 rounded-xl bg-surface-container-lowest dark:bg-zinc-800 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                Kategori
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-outline-variant/60 rounded-xl bg-surface-container-lowest dark:bg-zinc-800 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                Deskripsi
              </label>
              <textarea
                required
                rows={3}
                placeholder="Catatan transaksi..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-outline-variant/60 rounded-xl bg-surface-container-lowest dark:bg-zinc-800 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-xs text-error font-medium bg-error-container/50 p-2.5 rounded-lg border border-error/20">
                {errorMsg}
              </p>
            )}

            {/* Actions */}
            <div className="pt-3 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-2.5 border border-outline-variant rounded-xl text-primary dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider hover:bg-surface-container-low dark:hover:bg-zinc-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-primary text-white font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-secondary dark:hover:bg-emerald-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : isEditing ? (
                  "Perbarui"
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
