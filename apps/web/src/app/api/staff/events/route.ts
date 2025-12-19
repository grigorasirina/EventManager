import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const gate = await requireStaff();
  if (!gate.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));

  const {
    title,
    description,
    location,
    startsAt,
    endsAt,
    capacity,
    priceCents,
    currency,
  } = body ?? {};

  if (!title || !startsAt || !endsAt) {
    return NextResponse.json({ error: "title, startsAt, endsAt are required" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description: description ?? null,
      location: location ?? null,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      capacity: capacity ?? null,
      priceCents: Number(priceCents ?? 0),
      currency: currency ?? "GBP",
      createdById: gate.user.id,
    },
  });

  return NextResponse.json(event);
}
