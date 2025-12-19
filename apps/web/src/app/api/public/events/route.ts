import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      priceCents: true,
      currency: true,
    },
  });

  return NextResponse.json(events);
}
