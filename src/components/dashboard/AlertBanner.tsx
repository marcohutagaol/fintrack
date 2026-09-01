"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatPercentage } from "@/lib/utils";

interface AlertBannerProps {
  dbrRatio: number;
  isDbrWarning: boolean;
  isBalanceBelowTarget?: boolean;
}

export function AlertBanner({
  dbrRatio,
  isDbrWarning,
  isBalanceBelowTarget,
}: AlertBannerProps) {
  if (isDbrWarning) {
    return (
      <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-start gap-3.5 shadow-xs border border-[#ffb4ab]/80 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="p-1 rounded-lg bg-error/15 text-error mt-0.5 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-sm sm:text-base leading-snug">
            Peringatan: Rasio cicilan Anda mencapai {formatPercentage(dbrRatio)}, melebihi batas aman 30%.
          </p>
          <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
            Evaluasi kembali rencana pengeluaran bulan depan untuk menjaga kesehatan finansial dan likuiditas dana darurat.
          </p>
        </div>
      </div>
    );
  }

  if (isBalanceBelowTarget) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 p-4 rounded-xl flex items-start gap-3.5 shadow-xs border border-amber-200 dark:border-amber-800">
        <div className="p-1 rounded-lg bg-amber-200/50 text-amber-800 mt-0.5 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-sm sm:text-base leading-snug">
            Perhatian: Saldo saat ini berada di bawah target saldo minimal Anda.
          </p>
          <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
            Prioritaskan penghematan pada kategori non-esensial hingga target saldo minimal tercapai kembali.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 p-3.5 rounded-xl flex items-center gap-3 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
      <div className="p-1 rounded-lg bg-emerald-200/60 text-emerald-800 dark:text-emerald-300 shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <p className="text-xs sm:text-sm font-medium">
        Kondisi Keuangan Sehat: Rasio beban cicilan ({formatPercentage(dbrRatio)}) berada di bawah batas aman 30%.
      </p>
    </div>
  );
}
