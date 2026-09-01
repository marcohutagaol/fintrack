import { TransactionType } from "@/types/dashboard";

export interface TransactionItem {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  categoryId?: string;
  date: Date | string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  description?: string;
  categoryName: string;
  date?: string;
}

export interface UpdateTransactionInput extends CreateTransactionInput {
  id: string;
}

export const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx-mock-1",
    date: new Date("2023-10-24"),
    type: "EXPENSE",
    category: "Makanan & Minuman",
    description: "Makan Siang Klien",
    amount: 450000,
  },
  {
    id: "tx-mock-2",
    date: new Date("2023-10-23"),
    type: "INCOME",
    category: "Gaji",
    description: "Gaji Bulan Oktober",
    amount: 15000000,
  },
  {
    id: "tx-mock-3",
    date: new Date("2023-10-22"),
    type: "EXPENSE",
    category: "Transportasi",
    description: "Isi Bensin Mobil",
    amount: 300000,
  },
  {
    id: "tx-mock-4",
    date: new Date("2023-10-20"),
    type: "EXPENSE",
    category: "Tagihan",
    description: "Internet & TV Kabel",
    amount: 550000,
  },
  {
    id: "tx-mock-5",
    date: new Date("2023-10-18"),
    type: "EXPENSE",
    category: "Belanja",
    description: "Belanja Mingguan Supermarket",
    amount: 850000,
  },
  {
    id: "tx-mock-6",
    date: new Date("2023-10-15"),
    type: "INCOME",
    category: "Freelance",
    description: "Desain UI/UX Mobile App",
    amount: 4500000,
  },
  {
    id: "tx-mock-7",
    date: new Date("2023-10-10"),
    type: "EXPENSE",
    category: "Cicilan",
    description: "Cicilan Mobil Honda",
    amount: 4500000,
  },
  {
    id: "tx-mock-8",
    date: new Date("2023-10-05"),
    type: "EXPENSE",
    category: "Tempat Tinggal",
    description: "Sewa Kost Bulanan",
    amount: 2000000,
  },
];
