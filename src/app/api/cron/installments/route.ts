"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Vercel Cron Job Endpoint
 * Triggered on the 1st of every month to auto-increment paidMonths
 * for all active (non-completed) installments across all users,
 * and record an EXPENSE transaction for each payment.
 *
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find all active (non-completed) installments
    const activeInstallments = await prisma.installment.findMany({
      where: { isCompleted: false },
    });

    let processedCount = 0;
    let completedCount = 0;

    for (const installment of activeInstallments) {
      const nextPaidMonths = installment.paidMonths + 1;
      const isNowCompleted = nextPaidMonths >= installment.totalMonths;

      // Update installment
      await prisma.installment.update({
        where: { id: installment.id },
        data: {
          paidMonths: nextPaidMonths,
          isCompleted: isNowCompleted,
        },
      });

      // Record an automatic EXPENSE transaction
      let category = await prisma.category.findFirst({
        where: { userId: installment.userId, name: "Cicilan" },
      });

      if (!category) {
        category = await prisma.category.create({
          data: { name: "Cicilan", userId: installment.userId },
        });
      }

      await prisma.transaction.create({
        data: {
          type: "EXPENSE",
          amount: installment.monthlyPayment,
          description: `[Auto] Bayar ${installment.itemName} (Bulan ke-${nextPaidMonths}/${installment.totalMonths})`,
          categoryId: category.id,
          userId: installment.userId,
        },
      });

      processedCount++;
      if (isNowCompleted) completedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Cron job completed: ${processedCount} installments processed, ${completedCount} completed.`,
      processed: processedCount,
      completed: completedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
