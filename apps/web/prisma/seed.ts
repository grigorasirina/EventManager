import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in apps/api/.env");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.event.createMany({
    data: [
      {
        title: "Free Community Meetup",
        description: "A free tech meetup open to everyone.",
        location: "London",
        startsAt: new Date("2025-02-01T18:00:00Z"),
        endsAt: new Date("2025-02-01T20:00:00Z"),
        priceCents: 0,
        currency: "GBP",
      },
      {
        title: "Paid Workshop: Advanced Web Development",
        description: "Hands-on workshop covering advanced full-stack topics.",
        location: "London",
        startsAt: new Date("2025-02-10T10:00:00Z"),
        endsAt: new Date("2025-02-10T16:00:00Z"),
        priceCents: 7500,
        currency: "GBP",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
