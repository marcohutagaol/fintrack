"use client";

import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";
import { ActiveInstallment } from "@/types/dashboard";
import { formatRupiah } from "@/lib/utils";

interface ActiveInstallmentsProps {
  installments: ActiveInstallment[];
}

export function ActiveInstallments({ installments }: ActiveInstallmentsProps) {
  if (installments.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 border border-surface-variant dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-error/10 text-error">
            <CreditCard className="w-4 h-4" />
          </div>
          Cicilan Aktif
        </h3>
        <Link
          href="/installments"
          className="text-xs font-semibold text-primary dark:text-emerald-400 hover:underline hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          Kelola Cicilan <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* List */}
      <div className="space-y-4">
        {installments.map((item) => {
          const progressPercentage = Math.round(
            (item.paidMonths / item.totalMonths) * 100
          );
          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-surface-container-low dark:bg-zinc-800/40 border border-outline-variant/30 space-y-2.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm text-on-surface">
                    {item.itemName}
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Total: {formatRupiah(item.totalPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-error">
                    {formatRupiah(item.monthlyPayment)}
                  </span>
                  <span className="text-[11px] text-on-surface-variant block">
                    / bulan
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-on-surface-variant">
                  <span>
                    Progres: {item.paidMonths} dari {item.totalMonths} bulan
                  </span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
