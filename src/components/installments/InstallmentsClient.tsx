"use client";

import { useState, useMemo } from "react";
import {
  Wallet,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Laptop,
  Car,
  Smartphone,
  Home,
  Building,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Loader2,
  TrendingDown,
} from "lucide-react";
import {
  InstallmentItem,
  InstallmentSummary,
} from "@/types/installment";
import {
  deleteInstallment,
  payInstallmentMonth,
} from "@/app/actions/installments";
import { formatRupiah, formatPercentage } from "@/lib/utils";
import { InstallmentModal } from "./InstallmentModal";

interface InstallmentsClientProps {
  initialInstallments: InstallmentItem[];
  initialSummary: InstallmentSummary;
}

export function InstallmentsClient({
  initialInstallments,
  initialSummary,
}: InstallmentsClientProps) {
  const [installments, setInstallments] = useState<InstallmentItem[]>(initialInstallments);
  const [summary, setSummary] = useState<InstallmentSummary>(initialSummary);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<InstallmentItem | null>(null);

  // Quick pay & delete states
  const [payingId, setPayingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Category Icon Resolver
  const getItemIcon = (name: string, category?: string) => {
    const text = `${name} ${category || ""}`.toLowerCase();
    if (text.includes("laptop") || text.includes("komputer") || text.includes("macbook") || text.includes("pc")) {
      return Laptop;
    }
    if (text.includes("mobil") || text.includes("motor") || text.includes("kendaraan") || text.includes("honda")) {
      return Car;
    }
    if (text.includes("iphone") || text.includes("hp") || text.includes("samsung") || text.includes("phone")) {
      return Smartphone;
    }
    if (text.includes("kost") || text.includes("rumah") || text.includes("properti") || text.includes("apartemen")) {
      return Home;
    }
    if (text.includes("pendidikan") || text.includes("kuliah") || text.includes("kursus")) {
      return GraduationCap;
    }
    return CreditCard;
  };

  const handleOpenAdd = () => {
    setEditingInstallment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InstallmentItem) => {
    setEditingInstallment(item);
    setIsModalOpen(true);
  };

  const handlePayMonth = async (id: string, name: string) => {
    setPayingId(id);
    setFeedback(null);

    try {
      const res = await payInstallmentMonth(id);
      if (res.success) {
        setFeedback({ type: "success", message: res.message });
        setTimeout(() => setFeedback(null), 4000);
        window.location.reload();
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Gagal mencatat pembayaran cicilan." });
    } finally {
      setPayingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await deleteInstallment(id);
      if (res.success) {
        setInstallments((prev) => prev.filter((i) => i.id !== id));
        setDeletingId(null);
        setFeedback({ type: "success", message: "Cicilan berhasil dihapus!" });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Gagal menghapus cicilan.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold ${
              feedback.type === "success"
                ? "bg-secondary-container dark:bg-emerald-950 text-secondary-on-container dark:text-emerald-200 border-secondary/30"
                : "bg-error-container text-error border-error/30"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-secondary dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Summary Metrics Section (2 Big Stat Cards) */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Total Hutang Berjalan */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 p-6 lg:p-8 rounded-2xl border border-surface-variant dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] relative overflow-hidden transition-all duration-300 group">
            <div className="absolute top-2 right-2 p-4 opacity-5 dark:opacity-10 text-primary dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <Wallet className="w-28 h-28" />
            </div>

            <p className="text-xs lg:text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              Total Hutang Berjalan
            </p>
            <h3 className="text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
              {formatRupiah(summary.totalRemainingDebt)}
            </h3>

            <div className="flex items-center gap-2 text-xs text-on-surface-variant pt-3 border-t border-outline-variant/30">
              <TrendingDown className="w-4 h-4 text-primary dark:text-emerald-400" />
              <span>
                Dari <strong>{summary.activeCount}</strong> cicilan aktif yang belum lunas
              </span>
            </div>
          </div>

          {/* Card 2: Total Bayar Bulan Depan */}
          <div className="bg-primary text-white p-6 lg:p-8 rounded-2xl shadow-xl shadow-primary/20 relative overflow-hidden transition-all duration-300 group">
            {/* Geometric accent decorative circle */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xs pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <p className="text-xs lg:text-sm font-semibold uppercase tracking-wider text-primary-fixed-dim mb-2">
              Total Bayar Bulan Depan
            </p>
            <h3 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
              {formatRupiah(summary.totalNextMonthPayment)}
            </h3>

            <div className="flex items-center justify-between text-xs text-primary-fixed-dim pt-3 border-t border-white/15">
              <span>Jatuh Tempo: Tanggal 1 Tiap Bulan</span>
              <span className="font-semibold bg-white/15 px-2.5 py-0.5 rounded-full">
                Otomatis
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Header & Action */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-on-surface tracking-tight">
            Daftar Cicilan Aktif
          </h3>
          <p className="text-xs text-on-surface-variant">
            Pantau progres dan sisa tenor cicilan berjalan Anda.
          </p>
        </div>

        {/* Desktop Add Button */}
        <button
          onClick={handleOpenAdd}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-secondary dark:hover:bg-emerald-700 transition-all duration-200 shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Cicilan Baru</span>
        </button>
      </div>

      {/* Bento Grid Cards */}
      {installments.length === 0 ? (
        <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-12 text-center border border-surface-variant dark:border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-on-surface">
            Belum Ada Cicilan Aktif
          </h4>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Catat cicilan kendaraan, barang elektronik, atau tagihan bertahap untuk memantau sisa hutang dan beban bulanan Anda.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 px-4 py-2 bg-primary text-white font-semibold text-xs rounded-xl inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Cicilan Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {installments.map((item) => {
            const Icon = getItemIcon(item.itemName, item.category);
            const progress = Math.min(
              100,
              Math.round((item.paidMonths / item.totalMonths) * 100)
            );
            const remainingDebt = Math.max(
              0,
              (item.totalMonths - item.paidMonths) * item.monthlyPayment
            );
            const isCompleted = item.paidMonths >= item.totalMonths || item.isCompleted;

            return (
              <article
                key={item.id}
                className="bg-surface-container-lowest dark:bg-zinc-900 p-6 rounded-2xl border border-surface-variant dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:border-primary/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-surface-container-high dark:bg-zinc-800 flex items-center justify-center text-primary dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-on-surface line-clamp-1">
                          {item.itemName}
                        </h4>
                        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">
                          {item.category || "Elektronik"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                        isCompleted
                          ? "bg-secondary-container dark:bg-emerald-950 text-secondary-on-container dark:text-emerald-300"
                          : "bg-error-container/60 text-error"
                      }`}
                    >
                      {isCompleted ? "Lunas" : "Berjalan"}
                    </span>
                  </div>

                  {/* Monthly Payment */}
                  <div className="mb-4">
                    <p className="text-xl font-extrabold text-on-surface">
                      {formatRupiah(item.monthlyPayment)}{" "}
                      <span className="text-xs font-normal text-on-surface-variant">
                        / bln
                      </span>
                    </p>
                  </div>

                  {/* Progress Bar & Info */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                      <span>
                        Dibayar {item.paidMonths} dari {item.totalMonths} Bulan
                      </span>
                      <span className="text-primary dark:text-emerald-400 font-bold">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-variant dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? "bg-secondary" : "bg-primary"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Sisa Hutang */}
                  <div className="pt-3 border-t border-outline-variant/30 flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Sisa Hutang:</span>
                    <span className="font-bold text-sm text-on-surface">
                      {formatRupiah(remainingDebt)}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-2">
                  {!isCompleted ? (
                    <button
                      type="button"
                      disabled={payingId === item.id}
                      onClick={() => handlePayMonth(item.id, item.itemName)}
                      className="flex-1 py-2 px-3 bg-secondary-container dark:bg-emerald-950 hover:bg-secondary text-secondary-on-container dark:text-emerald-300 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      {payingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      <span>Bayar 1 Bulan</span>
                    </button>
                  ) : (
                    <span className="flex-1 text-center py-2 text-xs font-bold text-secondary dark:text-emerald-400 flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Lunas Sepenuhnya
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      aria-label="Edit Cicilan"
                      className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(item.id)}
                      aria-label="Hapus Cicilan"
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Mobile FAB */}
      <button
        type="button"
        aria-label="Tambah Cicilan"
        onClick={handleOpenAdd}
        className="fixed right-6 bottom-24 lg:hidden w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-secondary active:scale-95 transition-all z-40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Add / Edit Installment Modal */}
      <InstallmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => window.location.reload()}
        initialData={editingInstallment}
      />

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest dark:bg-zinc-900 max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-outline-variant/60 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-error-container/60 text-error flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-on-surface">
                Hapus Rencana Cicilan?
              </h3>
              <p className="text-xs text-on-surface-variant">
                Tindakan ini akan menghapus cicilan dari kalkulasi beban hutang bulanan Anda.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 border border-outline-variant rounded-xl font-semibold text-xs text-on-surface hover:bg-surface-container-low"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2.5 bg-error text-white rounded-xl font-semibold text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
