"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { TransactionType } from "@/types/dashboard";
import {
  TransactionItem,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/types/transaction";

export async function getTransactions(): Promise<TransactionItem[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const txs = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    return txs.map((tx) => ({
      id: tx.id,
      type: tx.type as TransactionType,
      amount: tx.amount,
      description: tx.description || tx.category?.name || "Transaksi",
      category: tx.category?.name || (tx.type === "INCOME" ? "Pemasukan" : "Pengeluaran"),
      categoryId: tx.categoryId || undefined,
      date: tx.date,
    }));
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return [];
  }
}

export async function createTransaction(input: CreateTransactionInput) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    let category = await prisma.category.findFirst({
      where: { userId, name: input.categoryName },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: input.categoryName, userId },
      });
    }

    await prisma.transaction.create({
      data: {
        type: input.type,
        amount: input.amount,
        description: input.description,
        date: input.date ? new Date(input.date) : new Date(),
        categoryId: category.id,
        userId,
      },
    });

    revalidatePath("/");
    revalidatePath("/transactions");

    return { success: true, message: "Transaksi berhasil disimpan ke database!" };
  } catch (error: any) {
    console.error("Failed to create transaction:", error);
    return { success: false, message: error.message || "Gagal menyimpan transaksi." };
  }
}

export async function updateTransaction(input: UpdateTransactionInput) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    let category = await prisma.category.findFirst({
      where: { userId, name: input.categoryName },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: input.categoryName, userId },
      });
    }

    await prisma.transaction.update({
      where: { id: input.id, userId },
      data: {
        type: input.type,
        amount: input.amount,
        description: input.description,
        date: input.date ? new Date(input.date) : undefined,
        categoryId: category.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/transactions");

    return { success: true, message: "Transaksi berhasil diperbarui!" };
  } catch (error: any) {
    console.error("Failed to update transaction:", error);
    return { success: false, message: error.message || "Gagal memperbarui transaksi." };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    await prisma.transaction.delete({
      where: { id, userId },
    });

    revalidatePath("/");
    revalidatePath("/transactions");

    return { success: true, message: "Transaksi berhasil dihapus secara permanen!" };
  } catch (error: any) {
    console.error("Failed to delete transaction:", error);
    return { success: false, message: error.message || "Gagal menghapus transaksi." };
  }
}
