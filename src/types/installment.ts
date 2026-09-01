export interface InstallmentItem {
  id: string;
  itemName: string;
  totalPrice: number;
  monthlyPayment: number;
  totalMonths: number;
  paidMonths: number;
  startDate: Date | string;
  isCompleted: boolean;
  category?: string;
}

export interface CreateInstallmentInput {
  itemName: string;
  totalPrice: number;
  monthlyPayment: number;
  totalMonths: number;
  paidMonths?: number;
  startDate?: string;
  category?: string;
}

export interface UpdateInstallmentInput extends CreateInstallmentInput {
  id: string;
}

export interface InstallmentSummary {
  totalRemainingDebt: number;
  totalNextMonthPayment: number;
  activeCount: number;
  completedCount: number;
}

export const MOCK_INSTALLMENTS: InstallmentItem[] = [
  {
    id: "inst-mock-1",
    itemName: "Laptop ASUS",
    totalPrice: 15000000,
    monthlyPayment: 1500000,
    totalMonths: 10,
    paidMonths: 3,
    startDate: new Date("2026-06-01"),
    isCompleted: false,
    category: "Elektronik",
  },
  {
    id: "inst-mock-2",
    itemName: "Cicilan Mobil",
    totalPrice: 72000000,
    monthlyPayment: 2000000,
    totalMonths: 36,
    paidMonths: 12,
    startDate: new Date("2025-08-01"),
    isCompleted: false,
    category: "Kendaraan",
  },
  {
    id: "inst-mock-3",
    itemName: "iPhone 15 Pro",
    totalPrice: 12000000,
    monthlyPayment: 1000000,
    totalMonths: 12,
    paidMonths: 8,
    startDate: new Date("2026-01-01"),
    isCompleted: false,
    category: "Elektronik",
  },
];
