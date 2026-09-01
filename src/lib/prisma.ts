import "server-only";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getCleanDatabaseUrl(): string {
  const rawUrl = process.env.DATABASE_URL || "";
  return rawUrl
    .replace(/["']/g, "")
    .replace(/[&?]channel_binding=require/g, "")
    .trim();
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = getCleanDatabaseUrl();

  if (!connectionString) {
    console.error("CRITICAL: DATABASE_URL environment variable is missing!");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
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