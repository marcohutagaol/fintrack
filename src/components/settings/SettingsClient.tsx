"use client";

import { useState } from "react";
import {
  Target,
  FolderTree,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  UserSettingsData,
  CategoryItem,
} from "@/types/settings";
import {
  updateUserSettings,
  createCategory,
  deleteCategory,
} from "@/app/actions/settings";
import { formatRupiah } from "@/lib/utils";

interface SettingsClientProps {
  initialSettings: UserSettingsData;
  initialCategories: CategoryItem[];
}

export function SettingsClient({
  initialSettings,
  initialCategories,
}: SettingsClientProps) {
  // Settings form state
  const [minBalanceTarget, setMinBalanceTarget] = useState(
    initialSettings.minBalanceTarget.toString()
  );
  const [estimatedNextIncome, setEstimatedNextIncome] = useState(
    initialSettings.estimatedNextIncome.toString()
  );
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Categories state
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryFeedback, setCategoryFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const minTarget = parseFloat(minBalanceTarget.replace(/[^0-9]/g, "")) || 0;
    const nextIncome = parseFloat(estimatedNextIncome.replace(/[^0-9]/g, "")) || 0;

    setIsSavingSettings(true);
    setSettingsFeedback(null);

    try {
      const res = await updateUserSettings({
        minBalanceTarget: minTarget,
        estimatedNextIncome: nextIncome,
      });

      if (res.success) {
        setSettingsFeedback({
          type: "success",
          message: "Pengaturan berhasil disimpan!",
        });
        setTimeout(() => setSettingsFeedback(null), 4000);
      } else {
        setSettingsFeedback({
          type: "error",
          message: res.message,
        });
      }
    } catch (err) {
      setSettingsFeedback({
        type: "error",
        message: "Terjadi kesalahan saat menyimpan pengaturan.",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newCategoryName.trim();
    if (!cleanName) return;

    setIsAddingCategory(true);
    setCategoryFeedback(null);

    try {
      const res = await createCategory(cleanName);
      if (res.success && res.category) {
        setCategories((prev) => [...prev, res.category!]);
        setNewCategoryName("");
        setCategoryFeedback({
          type: "success",
          message: "Kategori baru berhasil ditambahkan!",
        });
        setTimeout(() => setCategoryFeedback(null), 3000);
      } else {
        setCategoryFeedback({
          type: "error",
          message: res.message,
        });
      }
    } catch (err) {
      setCategoryFeedback({
        type: "error",
        message: "Gagal menambahkan kategori.",
      });
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus kategori "${name}"?`)) return;

    setDeletingCatId(id);
    setCategoryFeedback(null);

    try {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        setCategoryFeedback({
          type: "error",
          message: res.message,
        });
      }
    } catch (err) {
      setCategoryFeedback({
        type: "error",
        message: "Gagal menghapus kategori.",
      });
    } finally {
      setDeletingCatId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Target & Proyeksi Section (Bento Card 1 - lg:col-span-8) */}
      <section className="lg:col-span-8 bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl border border-outline-variant/40 dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] p-6 lg:p-8 flex flex-col justify-between">
        <div>
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 dark:bg-emerald-950/80 rounded-xl text-primary dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                Target & Proyeksi
              </h2>
              <p className="text-xs text-on-surface-variant">
                Konfigurasi batas aman saldo minimal dan estimasi pemasukan bulanan.
              </p>
            </div>
          </div>

          {/* Form */}
          <form id="settings-form" onSubmit={handleSaveSettings} className="space-y-6">
            {/* Target Saldo Minimal */}
            <div className="space-y-2">
              <label
                htmlFor="target_saldo"
                className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block"
              >
                Target Saldo Minimal
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-base">
                  Rp
                </span>
                <input
                  id="target_saldo"
                  type="text"
                  placeholder="0"
                  value={minBalanceTarget}
                  onChange={(e) => setMinBalanceTarget(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <p className="text-xs text-on-surface-variant/80">
                Dashboard akan memberikan peringatan jika total saldo Anda turun di bawah angka ini.
              </p>
            </div>

            {/* Estimasi Pemasukan Akhir Bulan Depan */}
            <div className="space-y-2">
              <label
                htmlFor="estimasi_pemasukan"
                className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block"
              >
                Estimasi Pemasukan Akhir Bulan Depan
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-base">
                  Rp
                </span>
                <input
                  id="estimasi_pemasukan"
                  type="text"
                  placeholder="0"
                  value={estimatedNextIncome}
                  onChange={(e) => setEstimatedNextIncome(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <p className="text-xs text-on-surface-variant/80">
                Digunakan untuk menghitung rasio beban cicilan (*Debt Burden Ratio* / DBR) bulanan.
              </p>
            </div>
          </form>
        </div>

        {/* Footer & Feedback */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {settingsFeedback && (
              <div
                className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg animate-in fade-in duration-200 ${
                  settingsFeedback.type === "success"
                    ? "bg-secondary-container dark:bg-emerald-950 text-secondary-on-container dark:text-emerald-300"
                    : "bg-error-container text-error"
                }`}
              >
                {settingsFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{settingsFeedback.message}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            form="settings-form"
            disabled={isSavingSettings}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-secondary dark:hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isSavingSettings ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan Pengaturan</span>
            )}
          </button>
        </div>
      </section>

      {/* Manajemen Kategori Section (Bento Card 2 - lg:col-span-4) */}
      <section className="lg:col-span-4 bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl border border-outline-variant/40 dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] p-6 lg:p-8 flex flex-col justify-between">
        <div>
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-secondary-container/50 dark:bg-emerald-950/80 rounded-xl text-secondary dark:text-emerald-300">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                Manajemen Kategori
              </h2>
              <p className="text-xs text-on-surface-variant">
                Kelola daftar kategori transaksi Anda.
              </p>
            </div>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Tambah Kategori Baru"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-grow px-3.5 py-2.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <button
              type="submit"
              disabled={isAddingCategory || !newCategoryName.trim()}
              aria-label="Tambah Kategori"
              className="p-2.5 rounded-xl bg-primary text-white hover:bg-secondary dark:hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-95 flex items-center justify-center shadow-xs"
            >
              {isAddingCategory ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* Category Feedback */}
          {categoryFeedback && (
            <p
              className={`text-xs mb-3 font-medium ${
                categoryFeedback.type === "success"
                  ? "text-secondary dark:text-emerald-400"
                  : "text-error"
              }`}
            >
              {categoryFeedback.message}
            </p>
          )}

          {/* Category List */}
          <div className="space-y-2 overflow-y-auto max-h-[320px] pr-1">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface dark:bg-zinc-800/60 hover:bg-surface-container-low dark:hover:bg-zinc-800 border border-transparent hover:border-outline-variant/40 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/40 dark:bg-emerald-400/40 group-hover:bg-primary transition-colors" />
                  <span className="text-xs font-semibold text-on-surface">
                    {cat.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  disabled={deletingCatId === cat.id}
                  title="Hapus Kategori"
                  className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-error transition-all p-1 rounded-md hover:bg-error-container/40"
                >
                  {deletingCatId === cat.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Category count info */}
        <div className="pt-4 mt-6 border-t border-outline-variant/30 text-[11px] text-on-surface-variant text-center">
          Total: <strong>{categories.length}</strong> Kategori Terdaftar
        </div>
      </section>
    </div>
  );
}
