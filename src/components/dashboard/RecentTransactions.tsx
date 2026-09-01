"use client";

import Link from "next/link";
import { History, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DashboardTransaction } from "@/types/dashboard";
import { formatRupiah, formatDateShort } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getCategoryBadgeClass = (category: string, type: string) => {
    if (type === "INCOME") {
      return "bg-secondary-container dark:bg-emerald-950 text-secondary-on-container dark:text-emerald-300 font-semibold";
    }
    if (category.toLowerCase().includes("cicilan")) {
      return "bg-error-container text-on-error-container font-semibold";
    }
    return "bg-surface-container-high dark:bg-zinc-800 text-on-surface font-medium";
  };

  return (
    <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 border border-surface-variant dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary dark:text-emerald-400">
            <History className="w-4 h-4" />
          </div>
          5 Transaksi Terakhir
        </h3>
        <Link
          href="/transactions"
          className="text-xs font-semibold text-primary dark:text-emerald-400 hover:underline hover:opacity-80 transition-opacity"
        >
          Lihat Semua →
        </Link>
      </div>

      {/* Table */}
      {transactions.length === 0 ? (
        <div className="py-8 text-center text-sm text-on-surface-variant">
          Belum ada transaksi tercatat. Klik tombol + untuk menambahkan transaksi baru.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant dark:border-zinc-800 text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 font-semibold">Tanggal</th>
                <th className="py-3 px-4 font-semibold">Keterangan / Kategori</th>
                <th className="py-3 px-4 font-semibold text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-surface-variant/50 dark:divide-zinc-800/60">
              {transactions.map((tx) => {
                const isIncome = tx.type === "INCOME";
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-surface-container-low dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* Tanggal */}
                    <td className="py-3.5 px-4 text-xs font-medium text-on-surface-variant whitespace-nowrap">
                      {formatDateShort(new Date(tx.date))}
                    </td>

                    {/* Kategori & Deskripsi */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs shrink-0 ${getCategoryBadgeClass(
                            tx.category,
                            tx.type
                          )}`}
                        >
                          {tx.category}
                        </span>
                        {tx.description && tx.description !== tx.category && (
                          <span className="text-xs text-on-surface-variant truncate max-w-[200px]">
                            {tx.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Nominal */}
                    <td className="py-3.5 px-4 text-right font-semibold whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          isIncome
                            ? "text-secondary dark:text-emerald-400"
                            : "text-on-surface"
                        }`}
                      >
                        {isIncome ? "+" : "-"} {formatRupiah(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
