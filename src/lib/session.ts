import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getCurrentUserId(): Promise<string | null> {
  // 1. Check NextAuth session (Google login etc.)
  try {
    const session = await auth();
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch (e) {
    // NextAuth session check ignored if unconfigured
  }

  // 2. Check cookie for registered/logged-in user ID (email/password login)
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get("fintrack-user-id")?.value;
    if (userIdCookie) {
      const user = await prisma.user.findUnique({ where: { id: userIdCookie } });
      if (user) return user.id;
    }
  } catch (e) {
    // Cookie store check failed
  }

  // 3. Not authenticated
  return null;
}
