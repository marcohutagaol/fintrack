"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { CategoryExpense } from "@/types/dashboard";
import { formatRupiah, formatPercentage } from "@/lib/utils";

interface ExpenseCategoryChartProps {
  data: CategoryExpense[];
}

export function ExpenseCategoryChart({ data }: ExpenseCategoryChartProps) {
  const totalExpense = data.reduce((sum, item) => sum + item.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategoryExpense;
      return (
        <div className="bg-surface-container-lowest dark:bg-zinc-900 p-3 rounded-xl shadow-lg border border-outline-variant/60 text-xs space-y-1">
          <div className="flex items-center gap-2 font-semibold text-on-surface">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}</span>
          </div>
          <p className="text-on-surface-variant font-medium">
            {formatRupiah(item.amount)} ({formatPercentage(item.percentage)})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 border border-surface-variant dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary dark:text-emerald-400">
            <PieChartIcon className="w-4 h-4" />
          </div>
          Pengeluaran Berdasarkan Kategori
        </h3>
        <span className="text-xs text-on-surface-variant font-medium">
          Total: {formatRupiah(totalExpense)}
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-64 w-full flex items-center justify-center my-2">
        {data.length === 0 ? (
          <div className="text-xs text-on-surface-variant text-center">
            Belum ada pengeluaran tercatat
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={95}
                paddingAngle={4}
                dataKey="amount"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Categories Legend */}
      <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-outline-variant/30">
        {data.map((category) => (
          <div
            key={category.name}
            className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant bg-surface-container-low dark:bg-zinc-800/60 px-3 py-1.5 rounded-full"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-on-surface">{category.name}</span>
            <span className="text-[11px] opacity-75">
              {formatPercentage(category.percentage)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
