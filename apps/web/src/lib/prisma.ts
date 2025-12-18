import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL missing in apps/web/.env or env vars");

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // store pool too so it isn't recreated on reloads
    globalForPrisma.pool = pool;

    return new PrismaClient({ adapter });
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
