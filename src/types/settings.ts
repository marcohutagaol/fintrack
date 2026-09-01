export interface UserSettingsData {
  minBalanceTarget: number;
  estimatedNextIncome: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  transactionCount?: number;
}

export const DEFAULT_MOCK_SETTINGS: UserSettingsData = {
  minBalanceTarget: 10000000,
  estimatedNextIncome: 25000000,
};

export const DEFAULT_MOCK_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", name: "Makanan" },
  { id: "cat-2", name: "Transportasi" },
  { id: "cat-3", name: "Kost" },
  { id: "cat-4", name: "Cicilan" },
  { id: "cat-5", name: "Gaji" },
  { id: "cat-6", name: "Belanja" },
  { id: "cat-7", name: "Tagihan" },
];
