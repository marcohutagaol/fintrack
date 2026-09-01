import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Auto-seed default categories and settings for new users
      if (user.id) {
        await prisma.$transaction([
          // Create default user settings
          prisma.userSetting.create({
            data: {
              userId: user.id,
              minBalanceTarget: 0,
              estimatedNextIncome: 0,
            },
          }),
          // Create default categories
          ...DEFAULT_CATEGORIES.map((name) =>
            prisma.category.create({
              data: {
                name,
                userId: user.id!,
              },
            })
          ),
        ]);
      }
    },
  },
});
