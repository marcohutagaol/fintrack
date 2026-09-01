"use server";

import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const DEFAULT_CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Hiburan",
  "Belanja",
  "Kesehatan",
  "Pendidikan",
  "Cicilan",
  "Lainnya",
];

export async function registerUser(formData: {
  fullName: string;
  email: string;
  password: string;
}) {
  try {
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanName = formData.fullName.trim();

    if (!cleanEmail || !formData.password || !cleanName) {
      return { success: false, message: "Semua field wajib diisi." };
    }

    if (formData.password.length < 8) {
      return { success: false, message: "Password minimal harus 8 karakter." };
    }

    // Check if user already exists in Neon PostgreSQL DB
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email ini sudah terdaftar. Silakan login ke akun Anda.",
      };
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Create new user in Neon DB
    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
      },
    });

    // Create user setting default
    await prisma.userSetting.create({
      data: {
        userId: newUser.id,
        minBalanceTarget: 0,
        estimatedNextIncome: 0,
      },
    });

    // Seed default categories for this specific user
    for (const catName of DEFAULT_CATEGORIES) {
      await prisma.category.create({
        data: {
          name: catName,
          userId: newUser.id,
        },
      });
    }

    // Set session cookies
    const cookieStore = await cookies();
    cookieStore.set("fintrack-session", "true", {
      path: "/",
      maxAge: 86400 * 7,
      sameSite: "lax",
    });
    cookieStore.set("fintrack-user-id", newUser.id, {
      path: "/",
      maxAge: 86400 * 7,
      sameSite: "lax",
    });

    return {
      success: true,
      message: "Akun berhasil didaftarkan ke database Neon!",
      userId: newUser.id,
    };
  } catch (error: any) {
    console.error("Failed to register user:", error);
    return {
      success: false,
      message: error.message || "Gagal mendaftarkan akun ke database.",
    };
  }
}

export async function loginUser(formData: {
  email: string;
  password: string;
}) {
  try {
    const cleanEmail = formData.email.trim().toLowerCase();

    if (!cleanEmail || !formData.password) {
      return { success: false, message: "Email dan password wajib diisi." };
    }

    // Find user in Neon PostgreSQL DB
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return {
        success: false,
        message: "Email tidak terdaftar. Silakan buat akun terlebih dahulu.",
      };
    }

    // If user has a password in DB, verify password
    if (user.password) {
      const isValid = await bcrypt.compare(formData.password, user.password);
      if (!isValid) {
        return {
          success: false,
          message: "Password yang Anda masukkan salah.",
        };
      }
    }

    // Set session cookies
    const cookieStore = await cookies();
    cookieStore.set("fintrack-session", "true", {
      path: "/",
      maxAge: 86400 * 7,
      sameSite: "lax",
    });
    cookieStore.set("fintrack-user-id", user.id, {
      path: "/",
      maxAge: 86400 * 7,
      sameSite: "lax",
    });

    return {
      success: true,
      message: `Selamat datang kembali, ${user.name || "User"}!`,
      userId: user.id,
    };
  } catch (error: any) {
    console.error("Failed to login user:", error);
    return {
      success: false,
      message: error.message || "Gagal login ke akun.",
    };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("fintrack-session");
    cookieStore.delete("fintrack-user-id");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
