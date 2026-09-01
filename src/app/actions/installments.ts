"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import {
  InstallmentItem,
  CreateInstallmentInput,
  UpdateInstallmentInput,
  InstallmentSummary,
} from "@/types/installment";

export async function getInstallments(): Promise<{
  installments: InstallmentItem[];
  summary: InstallmentSummary;
}> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { installments: [], summary: { totalRemainingDebt: 0, totalNextMonthPayment: 0, activeCount: 0, completedCount: 0 } };

    const items = await prisma.installment.findMany({
      where: { userId },
      orderBy: { isCompleted: "asc" },
    });

    const installments: InstallmentItem[] = items.map((item) => ({
      id: item.id,
      itemName: item.itemName,
      totalPrice: item.totalPrice,
      monthlyPayment: item.monthlyPayment,
      totalMonths: item.totalMonths,
      paidMonths: item.paidMonths,
      startDate: item.startDate,
      isCompleted: item.isCompleted,
    }));

    const active = installments.filter((i) => !i.isCompleted);
    const totalRemainingDebt = active.reduce(
      (sum, i) => sum + Math.max(0, (i.totalMonths - i.paidMonths) * i.monthlyPayment),
      0
    );
    const totalNextMonthPayment = active.reduce(
      (sum, i) => sum + i.monthlyPayment,
      0
    );

    return {
      installments,
      summary: {
        totalRemainingDebt,
        totalNextMonthPayment,
        activeCount: active.length,
        completedCount: installments.length - active.length,
      },
    };
  } catch (err) {
    console.error("Error fetching installments:", err);
    return {
      installments: [],
      summary: {
        totalRemainingDebt: 0,
        totalNextMonthPayment: 0,
        activeCount: 0,
        completedCount: 0,
      },
    };
  }
}

export async function createInstallment(input: CreateInstallmentInput) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    await prisma.installment.create({
      data: {
        itemName: input.itemName,
        totalPrice: input.totalPrice,
        monthlyPayment: input.monthlyPayment,
        totalMonths: input.totalMonths,
        paidMonths: input.paidMonths || 0,
        startDate: input.startDate ? new Date(input.startDate) : new Date(),
        isCompleted: (input.paidMonths || 0) >= input.totalMonths,
        userId,
      },
    });

    revalidatePath("/");
    revalidatePath("/installments");

    return { success: true, message: "Cicilan berhasil disimpan ke database!" };
  } catch (error: any) {
    console.error("Failed to create installment:", error);
    return {
      success: false,
      message: error.message || "Gagal menambahkan cicilan.",
    };
  }
}

export async function updateInstallment(input: UpdateInstallmentInput) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    const isCompleted = (input.paidMonths || 0) >= input.totalMonths;

    await prisma.installment.update({
      where: {
        id: input.id,
        userId,
      },
      data: {
        itemName: input.itemName,
        totalPrice: input.totalPrice,
        monthlyPayment: input.monthlyPayment,
        totalMonths: input.totalMonths,
        paidMonths: input.paidMonths,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        isCompleted,
      },
    });

    revalidatePath("/");
    revalidatePath("/installments");

    return { success: true, message: "Cicilan berhasil diperbarui!" };
  } catch (error: any) {
    console.error("Failed to update installment:", error);
    return {
      success: false,
      message: error.message || "Gagal memperbarui cicilan.",
    };
  }
}

export async function payInstallmentMonth(id: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    const installment = await prisma.installment.findUnique({
      where: { id, userId },
    });

    if (!installment) {
      return { success: false, message: "Cicilan tidak ditemukan." };
    }

    const nextPaidMonths = installment.paidMonths + 1;
    const isCompleted = nextPaidMonths >= installment.totalMonths;

    await prisma.installment.update({
      where: { id, userId },
      data: {
        paidMonths: nextPaidMonths,
        isCompleted,
      },
    });

    // Also record an automatic transaction expense for this installment payment
    let category = await prisma.category.findFirst({
      where: { userId, name: "Cicilan" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: "Cicilan", userId },
      });
    }

    await prisma.transaction.create({
      data: {
        type: "EXPENSE",
        amount: installment.monthlyPayment,
        description: `Bayar ${installment.itemName} (Bulan ke-${nextPaidMonths})`,
        categoryId: category.id,
        userId,
      },
    });

    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/installments");

    return {
      success: true,
      message: isCompleted
        ? "Selamat! Cicilan telah lunas sepenuhnya 🎉"
        : `Pembayaran bulan ke-${nextPaidMonths} berhasil dicatat di database!`,
    };
  } catch (error: any) {
    console.error("Failed to record installment payment:", error);
    return {
      success: false,
      message: error.message || "Gagal mencatat pembayaran cicilan.",
    };
  }
}

export async function deleteInstallment(id: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, message: "Anda harus login terlebih dahulu." };

    await prisma.installment.delete({
      where: {
        id,
        userId,
      },
    });

    revalidatePath("/");
    revalidatePath("/installments");

    return { success: true, message: "Cicilan berhasil dihapus secara permanen!" };
  } catch (error: any) {
    console.error("Failed to delete installment:", error);
    return {
      success: false,
      message: error.message || "Gagal menghapus cicilan.",
    };
  }
}
