"use client";

import { useState, useMemo } from "react";
import {
  Filter,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { deleteTransaction } from "@/app/actions/transactions";
import { TransactionItem } from "@/types/transaction";
import { formatRupiah, formatDateShort } from "@/lib/utils";
import { TransactionModal } from "./TransactionModal";

interface TransactionsClientProps {
  initialTransactions: TransactionItem[];
}

export function TransactionsClient({
  initialTransactions,
}: TransactionsClientProps) {
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derive unique categories and months for filtering
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set);
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      const matchesSearch =
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Type
      const matchesType =
        selectedType === "ALL" || tx.type === selectedType;

      // Category
      const matchesCategory =
        selectedCategory === "ALL" || tx.category === selectedCategory;

      // Month
      const txDate = new Date(tx.date);
      const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}`;
      const matchesMonth =
        selectedMonth === "ALL" || txMonth === selectedMonth;

      return matchesSearch && matchesType && matchesCategory && matchesMonth;
    });
  }, [transactions, searchQuery, selectedType, selectedCategory, selectedMonth]);

  // Paginated transactions
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: TransactionItem) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await deleteTransaction(id);
      if (res.success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        setDeletingId(null);
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Gagal menghapus transaksi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccess = () => {
    // When revalidatePath triggers or in demo mode, update local state
    window.location.reload();
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
            Daftar Transaksi
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 font-normal">
            Manajemen dan pantau riwayat arus kas harian Anda secara real-time.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-200 ${
                showFilterDropdown || selectedType !== "ALL" || selectedCategory !== "ALL" || selectedMonth !== "ALL"
                  ? "border-primary bg-primary/10 text-primary dark:text-emerald-400"
                  : "border-outline-variant/80 bg-surface-container-lowest dark:bg-zinc-900 text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Data</span>
            </button>

            {/* Filter Dropdown Popover */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-72 p-4 bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl shadow-xl border border-outline-variant/60 z-30 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                  <span className="text-xs font-bold text-on-surface">
                    Filter Transaksi
                  </span>
                  <button
                    onClick={() => {
                      setSelectedType("ALL");
                      setSelectedCategory("ALL");
                      setSelectedMonth("ALL");
                      setSearchQuery("");
                    }}
                    className="text-[11px] text-primary dark:text-emerald-400 font-semibold hover:underline"
                  >
                    Reset
                  </button>
                </div>

                {/* Filter Tipe */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                    Tipe Transaksi
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-surface-container-low dark:bg-zinc-800 rounded-lg text-xs border border-outline-variant/50 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="ALL">Semua Tipe</option>
                    <option value="EXPENSE">Hanya Pengeluaran</option>
                    <option value="INCOME">Hanya Pemasukan</option>
                  </select>
                </div>

                {/* Filter Kategori */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-surface-container-low dark:bg-zinc-800 rounded-lg text-xs border border-outline-variant/50 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="ALL">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Add Button */}
          <button
            onClick={handleOpenAdd}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-secondary dark:hover:bg-emerald-700 transition-all duration-200 shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Transaksi</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="w-4 h-4 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari transaksi berdasarkan keterangan atau kategori..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface shadow-xs transition-all"
        />
      </div>

      {/* Transactions Table (Glassmorphism Card) */}
      <div className="bg-surface-container-lowest/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-outline-variant/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 dark:bg-zinc-800/60 border-b border-outline-variant/40 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Tipe</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Deskripsi</th>
                <th className="py-3.5 px-4 text-right">Nominal (Rupiah)</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/40 dark:divide-zinc-800/60 text-sm">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    <p className="font-semibold text-base mb-1">Tidak ada transaksi ditemukan</p>
                    <p className="text-xs">Coba sesuaikan filter atau tambahkan transaksi baru.</p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const isIncome = tx.type === "INCOME";
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-surface-container-low/50 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* Tanggal */}
                      <td className="py-4 px-4 text-xs font-medium text-on-surface-variant whitespace-nowrap">
                        {formatDateShort(new Date(tx.date))}
                      </td>

                      {/* Tipe */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isIncome
                              ? "bg-secondary-container dark:bg-emerald-950 text-secondary-on-container dark:text-emerald-300"
                              : "bg-error-container text-on-error-container"
                          }`}
                        >
                          {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      </td>

                      {/* Kategori */}
                      <td className="py-4 px-4 text-xs font-medium text-on-surface-variant whitespace-nowrap">
                        {tx.category}
                      </td>

                      {/* Deskripsi */}
                      <td className="py-4 px-4 font-semibold text-on-surface">
                        {tx.description}
                      </td>

                      {/* Nominal */}
                      <td className="py-4 px-4 text-right font-bold whitespace-nowrap">
                        <span
                          className={
                            isIncome
                              ? "text-secondary dark:text-emerald-400"
                              : "text-on-surface"
                          }
                        >
                          {isIncome ? "+" : "-"} {formatRupiah(tx.amount)}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(tx)}
                            aria-label="Edit Transaksi"
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(tx.id)}
                            aria-label="Hapus Transaksi"
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3.5 border-t border-outline-variant/40 flex items-center justify-between bg-surface-container-lowest dark:bg-zinc-900 text-xs text-on-surface-variant">
          <span>
            Menampilkan {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} transaksi
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-on-surface px-1">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        type="button"
        aria-label="Tambah Transaksi"
        onClick={handleOpenAdd}
        className="fixed right-6 bottom-24 lg:hidden w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-secondary active:scale-95 transition-all z-40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Input / Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        initialData={editingTransaction}
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
                Hapus Transaksi?
              </h3>
              <p className="text-xs text-on-surface-variant">
                Tindakan ini tidak dapat dibatalkan. Transaksi akan dihapus permanen dari riwayat keuangan Anda.
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
