"use client";

import { Wallet, TrendingUp, CreditCard, Flag, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatRupiah, formatPercentage } from "@/lib/utils";

interface StatCardsProps {
  totalBalance: number;
  minBalanceTarget: number;
  estimatedNextIncome: number;
  monthlyInstallmentLoad: number;
  dbrRatio: number;
  isDbrWarning: boolean;
}

export function StatCards({
  totalBalance,
  minBalanceTarget,
  estimatedNextIncome,
  monthlyInstallmentLoad,
  dbrRatio,
  isDbrWarning,
}: StatCardsProps) {
  const isTargetAchieved = totalBalance >= minBalanceTarget;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Total Saldo */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 border border-surface-variant dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:border-primary/30 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-emerald-950 flex items-center justify-center text-primary dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200">
            <Wallet className="w-6 h-6" />
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isTargetAchieved
                ? "bg-secondary-container dark:bg-emerald-950 text-secondary-on-container dark:text-emerald-300"
                : "bg-error-container text-error"
            }`}
          >
            {isTargetAchieved ? "Aman" : "Di Bawah Target"}
          </span>
        </div>

        <p className="text-sm font-medium text-on-surface-variant mb-1">
          Total Saldo
        </p>
        <h3 className="text-3xl font-extrabold text-on-surface tracking-tight mb-3">
          {formatRupiah(totalBalance)}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
          <Flag className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span>
            Target Minimal:{" "}
            <strong className="text-on-surface font-semibold">
              {formatRupiah(minBalanceTarget)}
            </strong>
          </span>
        </div>
      </div>

      {/* Card 2: Estimasi Pemasukan */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 border border-surface-variant dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:border-secondary/30 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-container/60 dark:bg-emerald-950 flex items-center justify-center text-secondary dark:text-emerald-300 group-hover:scale-110 transition-transform duration-200">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-low dark:bg-zinc-800 text-on-surface-variant">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            Proyeksi
          </span>
        </div>

        <p className="text-sm font-medium text-on-surface-variant mb-1">
          Estimasi Pemasukan (Bulan Depan)
        </p>
        <h3 className="text-3xl font-extrabold text-on-surface tracking-tight mb-3">
          {formatRupiah(estimatedNextIncome)}
        </h3>

        <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
          <span>Sisa Setelah Cicilan:</span>
          <span className="font-semibold text-secondary dark:text-emerald-400">
            {formatRupiah(Math.max(0, estimatedNextIncome - monthlyInstallmentLoad))}
          </span>
        </div>
      </div>

      {/* Card 3: Beban Cicilan */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 border border-surface-variant dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:border-error/30 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-error-container/60 dark:bg-rose-950 flex items-center justify-center text-error dark:text-rose-400 group-hover:scale-110 transition-transform duration-200">
            <CreditCard className="w-6 h-6" />
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isDbrWarning
                ? "bg-error-container text-error"
                : "bg-surface-container-low dark:bg-zinc-800 text-on-surface-variant"
            }`}
          >
            DBR: {formatPercentage(dbrRatio)}
          </span>
        </div>

        <p className="text-sm font-medium text-on-surface-variant mb-1">
          Beban Cicilan (Bulan Depan)
        </p>
        <h3 className="text-3xl font-extrabold text-error tracking-tight mb-3">
          {formatRupiah(monthlyInstallmentLoad)}
        </h3>

        <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
          <span>Batas Aman: 30%</span>
          <span
            className={`font-semibold ${
              isDbrWarning ? "text-error" : "text-secondary"
            }`}
          >
            {isDbrWarning ? "Melebihi Batas" : "Dalam Batas Aman"}
          </span>
        </div>
      </div>
    </div>
  );
}
