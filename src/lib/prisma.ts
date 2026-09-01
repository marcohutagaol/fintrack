import "server-only";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getCleanDatabaseUrl(): string {
  const rawUrl = process.env.DATABASE_URL || "";
  return rawUrl
    .replace(/["']/g, "")
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require", "")
    .trim();
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = getCleanDatabaseUrl();

  if (!connectionString) {
    throw new Error(
      "CRITICAL: DATABASE_URL is missing in Vercel Environment Variables! Please add DATABASE_URL in Vercel Dashboard -> Settings -> Environment Variables."
    );
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});