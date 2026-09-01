"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Calculator } from "lucide-react";
import {
  InstallmentItem,
  CreateInstallmentInput,
} from "@/types/installment";
import {
  createInstallment,
  updateInstallment,
} from "@/app/actions/installments";

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: InstallmentItem | null;
}

const CATEGORIES = ["Elektronik", "Kendaraan", "Properti", "Pendidikan", "Lainnya"];

export function InstallmentModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: InstallmentModalProps) {
  const [itemName, setItemName] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [totalMonths, setTotalMonths] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [paidMonths, setPaidMonths] = useState("0");
  const [category, setCategory] = useState("Elektronik");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setItemName(initialData.itemName);
      setTotalPrice(initialData.totalPrice.toString());
      setTotalMonths(initialData.totalMonths.toString());
      setMonthlyPayment(initialData.monthlyPayment.toString());
      setPaidMonths(initialData.paidMonths.toString());
      setCategory(initialData.category || "Elektronik");
    } else {
      setItemName("");
      setTotalPrice("");
      setTotalMonths("");
      setMonthlyPayment("");
      setPaidMonths("0");
      setCategory("Elektronik");
    }
    setErrorMsg(null);
  }, [initialData, isOpen]);

  // Auto calculate monthly payment if total price and tenor are provided
  const handleAutoCalculate = () => {
    const price = parseFloat(totalPrice.replace(/[^0-9]/g, ""));
    const months = parseInt(totalMonths, 10);
    if (price && months && months > 0) {
      setMonthlyPayment(Math.round(price / months).toString());
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(totalPrice.replace(/[^0-9]/g, ""));
    const payment = parseFloat(monthlyPayment.replace(/[^0-9]/g, ""));
    const months = parseInt(totalMonths, 10);
    const paid = parseInt(paidMonths, 10) || 0;

    if (!itemName.trim()) {
      setErrorMsg("Nama cicilan wajib diisi");
      return;
    }
    if (!price || isNaN(price) || price <= 0) {
      setErrorMsg("Total harga harus lebih dari 0");
      return;
    }
    if (!months || isNaN(months) || months <= 0) {
      setErrorMsg("Tenor bulan harus lebih dari 0");
      return;
    }
    if (!payment || isNaN(payment) || payment <= 0) {
      setErrorMsg("Cicilan per bulan harus lebih dari 0");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (isEditing && initialData) {
        const res = await updateInstallment({
          id: initialData.id,
          itemName: itemName.trim(),
          totalPrice: price,
          monthlyPayment: payment,
          totalMonths: months,
          paidMonths: paid,
          category,
        });

        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = await createInstallment({
          itemName: itemName.trim(),
          totalPrice: price,
          monthlyPayment: payment,
          totalMonths: months,
          paidMonths: paid,
          category,
        });

        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-surface-container-lowest dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-low/50 dark:bg-zinc-800/50">
          <h3 className="text-lg font-bold text-on-surface">
            {isEditing ? "Edit Cicilan" : "Tambah Cicilan Baru"}
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
        <div className="p-6 overflow-y-auto">
          <form id="installment-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Barang / Cicilan */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                Nama Barang / Cicilan
              </label>
              <input
                type="text"
                required
                placeholder="Cth: Laptop ASUS, Cicilan Mobil, iPhone 15"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Total Harga */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                Harga Total (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  onBlur={handleAutoCalculate}
                  className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Grid 2 Cols: Tenor & Monthly Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tenor */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                  Tenor (Bulan)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="12"
                    value={totalMonths}
                    onChange={(e) => setTotalMonths(e.target.value)}
                    onBlur={handleAutoCalculate}
                    className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-outline-variant/60 dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-medium">
                    bln
                  </span>
                </div>
              </div>

              {/* Monthly Payment */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Cicilan / Bulan (Rp)
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoCalculate}
                    className="text-[10px] text-primary dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <Calculator className="w-3 h-3" /> Hitung
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Grid 2 Cols: Category & Paid Months */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kategori */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Paid Months */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                  Sudah Terbayar (Bulan)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={paidMonths}
                    onChange={(e) => setPaidMonths(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-outline-variant/60 dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-medium">
                    bln
                  </span>
                </div>
              </div>
            </div>

            {/* Error Feedback */}
            {errorMsg && (
              <p className="text-xs text-error font-medium bg-error-container/50 p-2.5 rounded-lg border border-error/20">
                {errorMsg}
              </p>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/40 bg-surface-container-low/50 dark:bg-zinc-800/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-primary dark:text-emerald-400 hover:bg-surface-container-high transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            form="installment-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-primary text-white hover:bg-secondary dark:hover:bg-emerald-700 transition-colors shadow-md shadow-primary/20 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : isEditing ? (
              "Perbarui Cicilan"
            ) : (
              "Simpan Cicilan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
