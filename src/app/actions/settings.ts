"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import {
  UserSettingsData,
  CategoryItem,
  DEFAULT_MOCK_SETTINGS,
} from "@/types/settings";

export async function getUserSettings(): Promise<UserSettingsData> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return DEFAULT_MOCK_SETTINGS;

    const setting = await prisma.userSetting.findUnique({
      where: { userId },
    });

    if (!setting) {
      return DEFAULT_MOCK_SETTINGS;
    }

    return {
      minBalanceTarget: setting.minBalanceTarget,
      estimatedNextIncome: setting.estimatedNextIncome,
    };
  } catch (err) {
    console.error("Error fetching user settings:", err);
    return DEFAULT_MOCK_SETTINGS;
  }
}

export async function updateUserSettings(data: UserSettingsData) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    await prisma.userSetting.upsert({
      where: { userId },
      update: {
        minBalanceTarget: data.minBalanceTarget,
        estimatedNextIncome: data.estimatedNextIncome,
      },
      create: {
        userId,
        minBalanceTarget: data.minBalanceTarget,
        estimatedNextIncome: data.estimatedNextIncome,
      },
    });

    revalidatePath("/");
    revalidatePath("/settings");

    return { success: true, message: "Pengaturan berhasil disimpan ke database!" };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return {
      success: false,
      message: error.message || "Gagal menyimpan pengaturan.",
    };
  }
}

export async function getUserCategories(): Promise<CategoryItem[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      transactionCount: c._count.transactions,
    }));
  } catch (err) {
    console.error("Error fetching user categories:", err);
    return [];
  }
}

export async function createCategory(name: string) {
  try {
    const cleanName = name.trim();
    if (!cleanName) {
      return { success: false, message: "Nama kategori tidak boleh kosong" };
    }

    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    const existing = await prisma.category.findFirst({
      where: {
        userId,
        name: { equals: cleanName, mode: "insensitive" },
      },
    });

    if (existing) {
      return { success: false, message: "Kategori dengan nama ini sudah ada" };
    }

    const category = await prisma.category.create({
      data: {
        name: cleanName,
        userId,
      },
    });

    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/settings");

    return {
      success: true,
      message: "Kategori berhasil ditambahkan!",
      category: { id: category.id, name: category.name },
    };
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return {
      success: false,
      message: error.message || "Gagal menambahkan kategori.",
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (category && category._count.transactions > 0) {
      return {
        success: false,
        message: `Kategori ini sedang digunakan oleh ${category._count.transactions} transaksi.`,
      };
    }

    await prisma.category.delete({
      where: { id, userId },
    });

    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/settings");

    return { success: true, message: "Kategori berhasil dihapus secara permanen!" };
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return {
      success: false,
      message: error.message || "Gagal menghapus kategori.",
    };
  }
}
