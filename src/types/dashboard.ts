export type TransactionType = "INCOME" | "EXPENSE";

export interface CategoryExpense {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface CashflowItem {
  period: string;
  income: number;
  expense: number;
}

export interface DashboardTransaction {
  id: string;
  date: Date | string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
}

export interface ActiveInstallment {
  id: string;
  itemName: string;
  totalPrice: number;
  monthlyPayment: number;
  totalMonths: number;
  paidMonths: number;
  startDate: Date | string;
}

export interface DashboardStats {
  totalBalance: number;
  minBalanceTarget: number;
  isBalanceBelowTarget: boolean;
  estimatedNextIncome: number;
  monthlyInstallmentLoad: number;
  dbrRatio: number;
  isDbrWarning: boolean;
  categoryExpenses: CategoryExpense[];
  cashflow: CashflowItem[];
  recentTransactions: DashboardTransaction[];
  activeInstallments: ActiveInstallment[];
  userName?: string;
  userEmail?: string;
  userImage?: string;
}
