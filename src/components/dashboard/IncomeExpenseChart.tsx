"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { CashflowItem } from "@/types/dashboard";
import { formatRupiah } from "@/lib/utils";

interface IncomeExpenseChartProps {
  data: CashflowItem[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-lowest dark:bg-zinc-900 p-3 rounded-xl shadow-lg border border-outline-variant/60 text-xs space-y-1.5 min-w-[160px]">
          <p className="font-bold text-on-surface border-b border-outline-variant/40 pb-1">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div
              key={`tooltip-${index}`}
              className="flex justify-between items-center gap-3"
            >
              <span className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-semibold text-on-surface">
                {formatRupiah(entry.value)}
              </span>
            </div>
          ))}
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
            <BarChart3 className="w-4 h-4" />
          </div>
          Pemasukan vs Pengeluaran
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-low dark:bg-zinc-800 text-on-surface-variant">
          Perbandingan Arus Kas
        </span>
      </div>

      {/* Bar Chart Canvas */}
      <div className="h-64 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
            barGap={12}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-outline-variant/30"
            />
            <XAxis
              dataKey="period"
              stroke="currentColor"
              className="text-xs text-on-surface-variant"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="currentColor"
              className="text-xs text-on-surface-variant"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000000}jt`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
            <Legend
              wrapperStyle={{ paddingTop: "12px" }}
              formatter={(value) => (
                <span className="text-xs font-medium text-on-surface-variant">
                  {value}
                </span>
              )}
            />
            <Bar
              name="Pemasukan"
              dataKey="income"
              fill="#456648"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
            <Bar
              name="Pengeluaran"
              dataKey="expense"
              fill="#ba1a1a"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Text */}
      <div className="text-center pt-3 border-t border-outline-variant/30 text-xs text-on-surface-variant">
        Rasio Pengeluaran terhadap Pemasukan:{" "}
        <strong className="text-on-surface font-semibold">
          {data.length > 0 && data[data.length - 1].income > 0
            ? `${Math.round(
                (data[data.length - 1].expense / data[data.length - 1].income) *
                  100
              )}%`
            : "0%"}
        </strong>
      </div>
    </div>
  );
}
