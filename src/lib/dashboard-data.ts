import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardStats, TransactionType } from "@/types/dashboard";

export const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  "Makanan & Minuman": "#163826", // Deep forest
  "Makanan": "#163826",
  "Kost": "#456648", // Medium sage
  "Tempat Tinggal": "#456648",
  "Transportasi": "#727973", // Slate outline
  "Transport": "#727973",
  "Cicilan Mobil": "#ba1a1a", // Red
  "Cicilan": "#ba1a1a",
  "Hiburan": "#e07a5f", // Warm terracotta
  "Belanja": "#f4a261", // Warm sand
  "Kesehatan": "#2a9d8f", // Teal
  "Pendidikan": "#3d5a80", // Steel blue
  "Lainnya": "#8d99ae",
};

export const MOCK_DASHBOARD_DATA: DashboardStats = {
  totalBalance: 25000000,
  minBalanceTarget: 10000000,
  isBalanceBelowTarget: false,
  estimatedNextIncome: 12000000,
  monthlyInstallmentLoad: 4500000,
  dbrRatio: 37.5,
  isDbrWarning: true,
  categoryExpenses: [
    { name: "Makanan", amount: 2500000, percentage: 38, color: "#163826" },
    { name: "Kost", amount: 2000000, percentage: 31, color: "#456648" },
    { name: "Transport", amount: 1200000, percentage: 18, color: "#727973" },
    { name: "Lainnya", amount: 850000, percentage: 13, color: "#9ac0a7" },
  ],
  cashflow: [
    { period: "Bulan Lalu", income: 12000000, expense: 7800000 },
    { period: "Bulan Ini", income: 12000000, expense: 6550000 },
  ],
  recentTransactions: [
    {
      id: "tx-1",
      date: new Date("2026-10-12"),
      description: "Makan Siang & Kopi",
      category: "Makanan",
      amount: 150000,
      type: "EXPENSE",
    },
    {
      id: "tx-2",
      date: new Date("2026-10-10"),
      description: "Gaji Bulanan",
      category: "Gaji",
      amount: 12000000,
      type: "INCOME",
    },
    {
      id: "tx-3",
      date: new Date("2026-10-08"),
      description: "Bensin & Parkir",
      category: "Transportasi",
      amount: 50000,
      type: "EXPENSE",
    },
    {
      id: "tx-4",
      date: new Date("2026-10-05"),
      description: "Cicilan Mobil Honda",
      category: "Cicilan Mobil",
      amount: 4500000,
      type: "EXPENSE",
    },
    {
      id: "tx-5",
      date: new Date("2026-10-01"),
      description: "Sewa Kost Bulanan",
      category: "Kost",
      amount: 2000000,
      type: "EXPENSE",
    },
  ],
  activeInstallments: [
    {
      id: "inst-1",
      itemName: "Cicilan Mobil Honda",
      totalPrice: 162000000,
      monthlyPayment: 4500000,
      totalMonths: 36,
      paidMonths: 14,
      startDate: new Date("2025-08-01"),
    },
    {
      id: "inst-2",
      itemName: "MacBook Pro M3",
      totalPrice: 24000000,
      monthlyPayment: 2000000,
      totalMonths: 12,
      paidMonths: 8,
      startDate: new Date("2026-02-01"),
    },
  ],
  userName: "Admin",
  userEmail: "admin@fintrack.app",
};

import { getCurrentUserId } from "@/lib/session";

export async function getDashboardData(): Promise<DashboardStats> {
  const emptyState: DashboardStats = {
    totalBalance: 0,
    minBalanceTarget: 0,
    isBalanceBelowTarget: false,
    estimatedNextIncome: 0,
    monthlyInstallmentLoad: 0,
    dbrRatio: 0,
    isDbrWarning: false,
    categoryExpenses: [],
    cashflow: [],
    recentTransactions: [],
    activeInstallments: [],
    userName: "User",
    userEmail: "",
  };

  try {
    const userId = await getCurrentUserId();
    if (!userId) return emptyState;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return emptyState;

    // Fetch user settings
    const setting = await prisma.userSetting.findUnique({
      where: { userId },
    });

    // Fetch transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    // Fetch active installments
    const installments = await prisma.installment.findMany({
      where: { userId, isCompleted: false },
      orderBy: { startDate: "desc" },
    });

    // Calculations

    const minBalanceTarget = setting?.minBalanceTarget || 0;
    const estimatedNextIncome = setting?.estimatedNextIncome || 0;

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type === "INCOME") {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        const catName = tx.category?.name || "Lainnya";
        categoryTotals[catName] = (categoryTotals[catName] || 0) + tx.amount;
      }
    });

    // Saldo = Pemasukan - Pengeluaran (dari transaksi nyata)
    // Pembayaran cicilan sudah tercatat sebagai transaksi EXPENSE, tidak perlu dikurangi lagi
    const totalBalance = totalIncome - totalExpense;
    const monthlyInstallmentLoad = installments.reduce(
      (sum, inst) => sum + inst.monthlyPayment,
      0
    );

    const dbrRatio =
      estimatedNextIncome > 0
        ? (monthlyInstallmentLoad / estimatedNextIncome) * 100
        : 0;

    const isDbrWarning = dbrRatio > 30;
    const isBalanceBelowTarget =
      minBalanceTarget > 0 && totalBalance < minBalanceTarget;

    // Build category breakdown
    const colorPalette = [
      "#163826",
      "#456648",
      "#727973",
      "#ba1a1a",
      "#e07a5f",
      "#f4a261",
      "#2a9d8f",
      "#9ac0a7",
    ];

    const categoryExpenses = Object.entries(categoryTotals).map(
      ([name, amount], index) => ({
        name,
        amount,
        percentage:
          totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
        color:
          DEFAULT_CATEGORY_COLORS[name] ||
          colorPalette[index % colorPalette.length],
      })
    );

    const recentTransactions = transactions.slice(0, 5).map((tx) => ({
      id: tx.id,
      date: tx.date,
      description: tx.description || tx.category?.name || "Transaksi",
      category: tx.category?.name || (tx.type === "INCOME" ? "Pemasukan" : "Pengeluaran"),
      amount: tx.amount,
      type: tx.type as TransactionType,
    }));

    return {
      totalBalance,
      minBalanceTarget,
      isBalanceBelowTarget,
      estimatedNextIncome,
      monthlyInstallmentLoad,
      dbrRatio: Math.round(dbrRatio * 10) / 10,
      isDbrWarning,
      categoryExpenses: categoryExpenses,
      cashflow: [
        {
          period: "Bulan Ini",
          income: totalIncome,
          expense: totalExpense,
        },
      ],
      recentTransactions,
      activeInstallments: installments.map((inst) => ({
        id: inst.id,
        itemName: inst.itemName,
        totalPrice: inst.totalPrice,
        monthlyPayment: inst.monthlyPayment,
        totalMonths: inst.totalMonths,
        paidMonths: inst.paidMonths,
        startDate: inst.startDate,
      })),
      userName: user?.name || "Admin",
      userEmail: user?.email || "user@fintrack.app",
      userImage: user?.image || undefined,
    };
  } catch (err) {
    console.error("getDashboardData error:", err);
    // Return safe empty state on error
    return {
      totalBalance: 0,
      minBalanceTarget: 0,
      isBalanceBelowTarget: false,
      estimatedNextIncome: 0,
      monthlyInstallmentLoad: 0,
      dbrRatio: 0,
      isDbrWarning: false,
      categoryExpenses: [],
      cashflow: [],
      recentTransactions: [],
      activeInstallments: [],
      userName: "User",
      userEmail: "",
    };
  }
}
